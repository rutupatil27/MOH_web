import { Router } from "express";

import * as c from "../controllers/publicController.js";
import { enquiryLimiter } from "../middleware/rateLimits.js";

export const publicRouter = Router();

publicRouter.get("/health", (_req, res) => res.json({ ok: true }));
publicRouter.get("/courses", c.listCourses);
publicRouter.get("/courses/:slug", c.getCourse);
publicRouter.get("/gallery", c.listGallery);
publicRouter.get("/site-settings", c.getSiteSettings);
publicRouter.post("/enquiries", enquiryLimiter, c.createEnquiry);
