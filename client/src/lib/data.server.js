/**
 * Server-only data access for route loaders and actions. React Router keeps
 * *.server.js modules out of the browser bundle; at runtime this resolves to
 * the same services the REST API uses.
 */
export { courses, enquiries, gallery, settings } from "@moh/server/services";
