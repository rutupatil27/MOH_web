import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("components/layout/PublicLayout.jsx", [
    index("pages/Home.jsx"),
    route("about", "pages/About.jsx"),
    route("courses", "pages/Courses.jsx"),
    route("courses/:slug", "pages/Course.jsx"),
    route("gallery", "pages/Gallery.jsx"),
    route("contact", "pages/Contact.jsx"),
    route("enquire", "pages/Enquire.jsx"),
    route("*", "pages/NotFound.jsx"),
  ]),

  route("sitemap.xml", "pages/resources/sitemap.js"),
  route("robots.txt", "pages/resources/robots.js"),

  ...prefix("admin", [
    route("login", "admin/pages/Login.jsx"),
    route("logout", "admin/pages/Logout.jsx"),
    layout("admin/AdminLayout.jsx", [
      index("admin/pages/Dashboard.jsx"),
      route("enquiries", "admin/pages/Enquiries.jsx"),
      route("enquiries/:id", "admin/pages/EnquiryDetail.jsx"),
      route("courses", "admin/pages/Courses.jsx"),
      route("courses/new", "admin/pages/CourseEdit.jsx", { id: "admin-course-new" }),
      route("courses/:id", "admin/pages/CourseEdit.jsx", { id: "admin-course-edit" }),
      route("gallery", "admin/pages/Gallery.jsx"),
      route("settings", "admin/pages/Settings.jsx"),
    ]),
  ]),
];
