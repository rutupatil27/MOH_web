import { Router } from "express";

import * as c from "../controllers/adminController.js";
import { requireAdmin, sameOrigin } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimits.js";
import { requireFile, singleImage } from "../middleware/upload.js";

export const adminRouter = Router();

adminRouter.use(sameOrigin);
adminRouter.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

adminRouter.post("/login", loginLimiter, c.login);
adminRouter.post("/logout", c.logout);

adminRouter.use(requireAdmin);

adminRouter.get("/me", c.me);
adminRouter.get("/dashboard", c.dashboard);

adminRouter.get("/enquiries", c.listEnquiries);
adminRouter.get("/enquiries/:id", c.getEnquiry);
adminRouter.patch("/enquiries/:id", c.updateEnquiry);

adminRouter.get("/courses", c.listCourses);
adminRouter.post("/courses", c.createCourse);
adminRouter.post("/courses/reorder", c.reorderCourses);
adminRouter.get("/courses/:id", c.getCourse);
adminRouter.patch("/courses/:id", c.updateCourse);
adminRouter.delete("/courses/:id", c.deleteCourse);
adminRouter.post("/courses/:id/image", singleImage, requireFile, c.uploadCourseImage);
adminRouter.delete("/courses/:id/image", c.deleteCourseImage);

adminRouter.get("/gallery", c.listGallery);
adminRouter.post("/gallery", singleImage, requireFile, c.uploadGalleryItem);
adminRouter.post("/gallery/reorder", c.reorderGallery);
adminRouter.patch("/gallery/:id", c.updateGalleryItem);
adminRouter.delete("/gallery/:id", c.deleteGalleryItem);

adminRouter.get("/site-settings", c.getSettings);
adminRouter.patch("/site-settings", c.updateSettings);
