/**
 * Business logic, shared by the REST API (controllers) and the server-rendered
 * public pages (route loaders/actions in client/src/**.server.js).
 */
import { countCourses } from "./courseService.js";
import { enquiryCounts } from "./enquiryService.js";
import { countGallery } from "./galleryService.js";

export * as auth from "./authService.js";
export * as courses from "./courseService.js";
export * as enquiries from "./enquiryService.js";
export * as gallery from "./galleryService.js";
export * as settings from "./settingsService.js";

export async function dashboardSummary() {
  const [enquiries, courseCount, galleryCount] = await Promise.all([enquiryCounts(), countCourses(), countGallery()]);
  return { enquiries, courseCount, galleryCount };
}
