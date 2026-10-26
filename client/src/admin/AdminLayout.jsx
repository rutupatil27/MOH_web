import { useEffect, useState } from "react";
import { Form, Link, NavLink, Outlet, useLoaderData, useLocation, useNavigation } from "react-router";

import { Icon } from "../components/ui/Icon.jsx";
import { Logo } from "../components/ui/Logo.jsx";
import { load } from "./api.js";

export async function clientLoader() {
  const { admin } = await load("/me");
  return { admin };
}

export function meta() {
  return [{ title: "Admin | The Music of Heart" }, { name: "robots", content: "noindex, nofollow" }];
}

export function HydrateFallback() {
  return (
    <div data-surface="paper" className="grid min-h-dvh place-items-center">
      <p className="text-muted" role="status">
        Loading the admin panel…
      </p>
    </div>
  );
}

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { admin } = useLoaderData();
  const navigation = useNavigation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15.5rem_1fr]">
      <aside data-surface="dark" className="border-b border-line lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center justify-between px-5 lg:h-auto lg:px-6 lg:pt-7 lg:pb-8">
          <Link to="/admin" aria-label="Admin dashboard">
            <Logo className="h-10 w-auto lg:h-12" showSubline={false} />
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="admin-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
        <nav id="admin-nav" aria-label="Admin" className={`${menuOpen ? "block" : "hidden"} px-3 pb-5 lg:block`}>
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center rounded-xs px-3 py-2.5 no-underline transition-colors ${
                      isActive ? "bg-raised text-accent" : "text-muted hover:text-fg"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line px-3 pt-5 text-small">
            <p className="truncate text-muted" title={admin.email}>
              {admin.email}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 no-underline hover:text-accent">
                View site
                <Icon name="external" size={15} />
              </a>
              <Form method="post" action="/admin/logout">
                <button type="submit" className="inline-flex items-center gap-1.5 hover:text-accent">
                  <Icon name="logout" size={16} />
                  Sign out
                </button>
              </Form>
            </div>
          </div>
        </nav>
      </aside>

      <main data-surface="paper" className="min-h-dvh px-5 py-8 sm:px-8 lg:px-12 lg:py-10" aria-busy={navigation.state === "loading"}>
        <div className={`mx-auto max-w-[72rem] transition-opacity duration-(--dur-base) ${navigation.state === "loading" ? "opacity-60" : ""}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div data-surface="paper" className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md">
        <h1 className="font-display text-h3">The admin panel hit a problem.</h1>
        <p className="mt-3 text-muted">{error?.message ?? "Please reload the page."}</p>
        <a href="/admin" className="btn btn-primary mt-6">
          Reload
        </a>
      </div>
    </div>
  );
}
