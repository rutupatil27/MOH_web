import { Link, useRouteLoaderData } from "react-router";

import { NAV } from "../lib/site.js";

export function NotFoundContent() {
  const root = useRouteLoaderData("root");
  return (
    <section data-surface="dark" className="section min-h-[70svh]" aria-labelledby="nf-title">
      <div className="container-site">
        <h1 id="nf-title" className="max-w-[14ch] font-display text-h1">
          This page isn’t on the programme.
        </h1>
        <p className="mt-6 max-w-[46ch] text-lead text-muted">The link may be old or mistyped. Try one of these instead:</p>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="link-accent">
                {item.label}
              </Link>
            </li>
          ))}
          {(root?.courses ?? []).map((c) => (
            <li key={c.slug}>
              <Link to={`/courses/${c.slug}`} className="link-accent">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
