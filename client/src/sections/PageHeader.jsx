import { Link } from "react-router";

/** Opening band for inner pages: breadcrumb, a display-scale title, one paragraph. */
export function PageHeader({ title, intro, crumbs = [], children }) {
  return (
    <section data-surface="dark" className="border-b border-line" aria-labelledby="page-title">
      <div className="container-site pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(3rem,7vw,6rem)]">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-10 text-small text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {i < crumbs.length - 1 ? (
                    <Link to={c.path} className="no-underline hover:text-accent">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-fg">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <h1 id="page-title" className="font-display text-display lg:col-span-8">
            {title}
          </h1>
          {intro ? <p className="max-w-[42ch] text-lead text-muted lg:col-span-4 lg:self-end lg:pb-2">{intro}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
