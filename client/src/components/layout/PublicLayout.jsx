import { Outlet, isRouteErrorResponse, useRouteError, useRouteLoaderData } from "react-router";

import { NotFoundContent } from "../../sections/NotFoundContent.jsx";

import { MobileActionBar } from "./MobileActionBar.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { SiteHeader } from "./SiteHeader.jsx";

export default function PublicLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

/** 404s (unknown pages, unpublished courses) keep the header, footer and call bar. */
export function ErrorBoundary() {
  const error = useRouteError();
  if (!isRouteErrorResponse(error) || error.status !== 404) throw error;
  return (
    <Shell>
      <title>Page not found | The Music of Heart</title>
      <meta name="robots" content="noindex" />
      <NotFoundContent />
    </Shell>
  );
}

function Shell({ children }) {
  const { settings, courses } = useRouteLoaderData("root") ?? {};
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} courses={courses} />
      <MobileActionBar settings={settings} />
    </>
  );
}
