import { describe, expect, it } from "vitest";

import { enquirySchema, fieldErrors, formatIndianMobile, normalizeIndianMobile, siteSettingsSchema } from "./index.js";

describe("Indian mobile numbers", () => {
  it.each([
    ["8552829977", "+918552829977"],
    ["+91 85528 29977", "+918552829977"],
    ["91-85528-29977", "+918552829977"],
    ["085528 29977", "+918552829977"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeIndianMobile(input)).toBe(expected);
  });

  it.each(["12345", "5552829977", "85528299771", "abcdefghij", ""])("rejects %s", (input) => {
    expect(normalizeIndianMobile(input)).toBeNull();
  });

  it("formats for display", () => {
    expect(formatIndianMobile("8552829977")).toBe("+91 85528 29977");
  });
});

describe("enquirySchema", () => {
  const valid = {
    name: "Asha Patil",
    phone: "98765 43210",
    course: "guitar",
    level: "beginner",
    preferredContact: "call",
    message: "",
  };

  it("accepts a valid enquiry and normalizes the phone", () => {
    const result = enquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data.phone).toBe("+919876543210");
  });

  it("accepts an undecided visitor", () => {
    expect(enquirySchema.safeParse({ ...valid, course: "undecided", level: "undecided" }).success).toBe(true);
  });

  it("reports readable field errors", () => {
    const result = enquirySchema.safeParse({ ...valid, name: "A", phone: "123", level: "expert" });
    expect(result.success).toBe(false);
    const errors = fieldErrors(result.error);
    expect(errors.name).toMatch(/at least 2/);
    expect(errors.phone).toMatch(/10-digit/);
    expect(errors.level).toBeTruthy();
  });

  it("rejects a malformed course slug", () => {
    expect(enquirySchema.safeParse({ ...valid, course: "Piano!!" }).success).toBe(false);
  });

  it("caps the message length", () => {
    expect(enquirySchema.safeParse({ ...valid, message: "x".repeat(1001) }).success).toBe(false);
  });
});

describe("siteSettingsSchema", () => {
  it("allows unknown facts to stay empty", () => {
    const result = siteSettingsSchema.safeParse({ academyName: "The Music of Heart Music Academy" });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("");
    expect(result.data.youtubeUrl).toBe("");
  });

  it("requires https links", () => {
    const result = siteSettingsSchema.safeParse({ academyName: "X Academy", instagramUrl: "instagram.com/x" });
    expect(result.success).toBe(false);
  });
});
