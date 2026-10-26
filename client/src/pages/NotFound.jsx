import { data } from "react-router";

import { NotFoundContent } from "../sections/NotFoundContent.jsx";

export function loader() {
  throw data("Not found", { status: 404 });
}

export function meta() {
  return [{ title: "Page not found | The Music of Heart" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return null;
}

/** Rendered inside the public layout, so the header, footer and call bar stay available. */
export function ErrorBoundary() {
  return <NotFoundContent />;
}
