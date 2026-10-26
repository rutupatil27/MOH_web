import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import sharp from "sharp";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let app;
let mongo;
const ORIGIN = "http://moh.test";

beforeAll(async () => {
  process.env.UPLOAD_DIR = await fs.mkdtemp(path.join(os.tmpdir(), "moh-uploads-"));
  mongo = await MongoMemoryServer.create({ binary: { version: "8.2.6" } });
  await mongoose.connect(mongo.getUri("moh-test"));
  const { ensureSeedData } = await import("../src/services/seedService.js");
  const { setAdmin } = await import("../src/services/authService.js");
  await ensureSeedData();
  await setAdmin({ email: "owner@example.com", password: "correct horse battery" });
  const { createApp } = await import("../src/app.js");
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

const validEnquiry = {
  name: "Asha Patil",
  phone: "98765 43210",
  course: "guitar",
  level: "beginner",
  preferredContact: "call",
  message: "Is there a batch for my daughter?",
};

async function signIn() {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/admin/login")
    .set("Origin", ORIGIN)
    .send({ email: "owner@example.com", password: "correct horse battery" });
  expect(res.status).toBe(200);
  return agent;
}

describe("public API", () => {
  it("lists the four confirmed courses with both levels, and no piano", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.status).toBe(200);
    expect(res.body.courses.map((c) => c.slug)).toEqual(["guitar", "keyboard", "vocals", "drums"]);
    for (const course of res.body.courses) {
      expect(course.levels.map((l) => l.level)).toEqual(["beginner", "advanced"]);
    }
    expect(JSON.stringify(res.body).toLowerCase()).not.toContain("piano");
  });

  it("returns one course by slug and 404 for unknown ones", async () => {
    expect((await request(app).get("/api/courses/drums")).body.course.name).toBe("Drums");
    expect((await request(app).get("/api/courses/piano")).status).toBe(404);
  });

  it("serves confirmed settings and leaves unknown facts empty", async () => {
    const { body } = await request(app).get("/api/site-settings");
    expect(body.settings.phone).toBe("+918552829977");
    expect(body.settings.founderName).toBe("Mr. Aryan Tisawar");
    expect(body.settings.email).toBe("");
    expect(body.settings.hours).toBe("");
  });

  it("accepts a valid enquiry", async () => {
    const res = await request(app).post("/api/enquiries").send(validEnquiry);
    expect(res.status).toBe(201);
  });

  it("rejects invalid enquiries with field messages", async () => {
    const res = await request(app).post("/api/enquiries").send({ ...validEnquiry, phone: "12", course: "piano" });
    expect(res.status).toBe(422);
    expect(res.body.fields.phone).toBeTruthy();
  });

  it("rejects a course that is not offered", async () => {
    const res = await request(app).post("/api/enquiries").send({ ...validEnquiry, course: "piano" });
    expect(res.status).toBe(422);
    expect(res.body.fields.course).toBeTruthy();
  });

  it("silently discards honeypot submissions", async () => {
    const before = await mongoose.connection.collection("enquiries").countDocuments();
    const res = await request(app).post("/api/enquiries").send({ ...validEnquiry, website: "spam.example" });
    expect(res.status).toBe(201);
    expect(await mongoose.connection.collection("enquiries").countDocuments()).toBe(before);
  });

  it("returns JSON 404 for unknown API routes", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
  });
});

describe("admin API", () => {
  it("blocks unauthenticated access", async () => {
    expect((await request(app).get("/api/admin/enquiries")).status).toBe(401);
  });

  it("rejects wrong passwords without revealing which part was wrong", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .set("Origin", ORIGIN)
      .send({ email: "owner@example.com", password: "wrong password!!" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("That email and password do not match.");
  });

  it("blocks cross-site writes", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .set("Origin", "https://evil.example")
      .send({ email: "owner@example.com", password: "correct horse battery" });
    expect(res.status).toBe(403);
  });

  it("never returns the password hash", async () => {
    const agent = await signIn();
    const res = await agent.get("/api/admin/me");
    expect(res.body.admin.email).toBe("owner@example.com");
    expect(JSON.stringify(res.body)).not.toContain("passwordHash");
  });

  it("lists enquiries and moves one through its statuses", async () => {
    const agent = await signIn();
    const list = await agent.get("/api/admin/enquiries?status=new");
    expect(list.body.items.length).toBeGreaterThan(0);
    const id = list.body.items[0].id;
    const updated = await agent
      .patch(`/api/admin/enquiries/${id}`)
      .set("Origin", ORIGIN)
      .send({ status: "contacted", adminNote: "Called back." });
    expect(updated.body.enquiry.status).toBe("contacted");
    const bad = await agent.patch(`/api/admin/enquiries/${id}`).set("Origin", ORIGIN).send({ status: "paid" });
    expect(bad.status).toBe(422);
  });

  it("summarises the dashboard", async () => {
    const agent = await signIn();
    const res = await agent.get("/api/admin/dashboard");
    expect(res.body.courseCount).toBe(4);
    expect(res.body.enquiries.total).toBeGreaterThan(0);
  });

  it("validates course edits and rejects duplicate slugs", async () => {
    const agent = await signIn();
    const { body } = await agent.get("/api/admin/courses");
    const guitar = body.courses.find((c) => c.slug === "guitar");
    const dup = await agent
      .patch(`/api/admin/courses/${guitar.id}`)
      .set("Origin", ORIGIN)
      .send({ ...guitar, slug: "drums" });
    expect(dup.status).toBe(422);
    expect(dup.body.fields.slug).toBeTruthy();
  });

  it("uploads, edits, publishes and deletes a gallery photo", async () => {
    const agent = await signIn();
    const png = await sharp({ create: { width: 1200, height: 800, channels: 3, background: "#7a5a2a" } })
      .png()
      .toBuffer();
    const missingAlt = await agent
      .post("/api/admin/gallery")
      .set("Origin", ORIGIN)
      .attach("image", png, { filename: "class.png", contentType: "image/png" });
    expect(missingAlt.status).toBe(422);

    const created = await agent
      .post("/api/admin/gallery")
      .set("Origin", ORIGIN)
      .field("altText", "Student practising guitar at the academy")
      .attach("image", png, { filename: "class.png", contentType: "image/png" });
    expect(created.status).toBe(201);
    expect(created.body.item.image.variants.length).toBeGreaterThan(0);
    expect(created.body.item.image.key).toBeUndefined();

    const publicList = await request(app).get("/api/gallery");
    expect(publicList.body.items).toHaveLength(1);

    const id = created.body.item.id;
    await agent
      .patch(`/api/admin/gallery/${id}`)
      .set("Origin", ORIGIN)
      .send({ altText: "Student practising guitar", published: false });
    expect((await request(app).get("/api/gallery")).body.items).toHaveLength(0);

    expect((await agent.delete(`/api/admin/gallery/${id}`).set("Origin", ORIGIN)).status).toBe(204);
  });

  it("rejects non-image uploads", async () => {
    const agent = await signIn();
    const res = await agent
      .post("/api/admin/gallery")
      .set("Origin", ORIGIN)
      .field("altText", "Not an image")
      .attach("image", Buffer.from("hello"), { filename: "x.png", contentType: "image/png" });
    expect(res.status).toBe(415);
  });

  it("validates settings and keeps unknown fields empty", async () => {
    const agent = await signIn();
    const { body } = await agent.get("/api/admin/site-settings");
    const bad = await agent
      .patch("/api/admin/site-settings")
      .set("Origin", ORIGIN)
      .send({ ...body.settings, youtubeUrl: "youtube.com/x" });
    expect(bad.status).toBe(422);
    const ok = await agent
      .patch("/api/admin/site-settings")
      .set("Origin", ORIGIN)
      .send({ ...body.settings, hours: "" });
    expect(ok.status).toBe(200);
  });

  it("logs out", async () => {
    const agent = await signIn();
    await agent.post("/api/admin/logout").set("Origin", ORIGIN);
    expect((await agent.get("/api/admin/me")).status).toBe(401);
  });
});
