import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteLoaderData } from "react-router";

import abrilWoff2 from "@fontsource/abril-fatface/files/abril-fatface-latin-400-normal.woff2?url";
import jostWoff2 from "@fontsource-variable/jost/files/jost-latin-wght-normal.woff2?url";

import { Logo } from "./components/ui/Logo.jsx";
import { courses, settings } from "./lib/data.server.js";
import "./styles/app.css";

export async function loader() {
  const [site, published] = await Promise.all([settings.getSettings(), courses.listPublishedCourses()]);
  const { id, createdAt, updatedAt, ...publicSettings } = site;
  return {
    siteUrl: (process.env.SITE_URL || "https://themusicofheart.com").replace(/\/+$/, ""),
    settings: publicSettings,
    courses: published.map((c) => ({ name: c.name, slug: c.slug, shortDescription: c.shortDescription })),
  };
}

// Site-wide data rarely changes between navigations; only refetch after a form submission.
export function shouldRevalidate({ formMethod, defaultShouldRevalidate }) {
  return formMethod ? defaultShouldRevalidate : false;
}

export const links = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preload", href: abrilWoff2, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: jostWoff2, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function Layout({ children }) {
  return (
    <html lang="en-IN" data-surface="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0b0a08" />
        <meta name="format-detection" content="telephone=no" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  const data = useRouteLoaderData("root");
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const title = notFound ? "This page isn’t on the programme." : "Something went wrong on our side.";
  const detail = notFound
    ? "The link may be old or mistyped."
    : "Please try again in a moment. If it keeps happening, call the academy.";

  return (
    <main data-surface="dark" className="flex min-h-dvh flex-col">
      <title>{notFound ? "Page not found | The Music of Heart" : "Error | The Music of Heart"}</title>
      <div className="container-site flex flex-1 flex-col justify-center py-20">
        <Link to="/" aria-label="The Music of Heart — home" className="mb-16 inline-block w-fit">
          <Logo className="h-14 w-auto" showSubline={false} />
        </Link>
        <h1 className="max-w-[16ch] font-display text-h1">{title}</h1>
        <p className="mt-6 max-w-[48ch] text-lead text-muted">{detail}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-primary">
            Go to the homepage
          </Link>
          {data?.settings?.phone ? (
            <a href={`tel:${data.settings.phone}`} className="btn btn-secondary">
              Call the academy
            </a>
          ) : null}
        </div>
        {import.meta.env.DEV && error instanceof Error ? (
          <pre className="mt-12 max-w-full overflow-x-auto text-micro text-muted">{error.stack}</pre>
        ) : null}
      </div>
    </main>
  );
}
