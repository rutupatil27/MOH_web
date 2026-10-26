import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { NAV, phoneOf } from "../../lib/site.js";
import { Button } from "../ui/Button.jsx";
import { Icon } from "../ui/Icon.jsx";
import { Logo } from "../ui/Logo.jsx";

const MENU_ID = "site-menu";

export function SiteHeader({ settings }) {
  const location = useLocation();
  const phone = phoneOf(settings);

  // The menu is a native popover (works without JavaScript); close it after navigating.
  useEffect(() => {
    const menu = document.getElementById(MENU_ID);
    if (menu?.matches?.(":popover-open")) menu.hidePopover();
  }, [location.pathname]);

  return (
    <header data-surface="dark" className="sticky top-0 z-(--z-header) border-b border-line">
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <Link to="/" className="-my-2 flex items-center py-2" aria-label="The Music of Heart — home">
          <Logo className="h-12 w-auto sm:h-14" title="The Music of Heart Music Academy" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `relative py-2 text-[0.975rem] tracking-[0.02em] no-underline transition-colors duration-(--dur-base) hover:text-accent ${
                      isActive
                        ? "text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent"
                        : "text-muted"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={phone.href}
              className="hidden items-center gap-2 text-small text-muted no-underline transition-colors hover:text-accent xl:flex tabular"
            >
              <Icon name="phone" size={17} />
              {phone.display}
            </a>
          ) : null}
          <Button to="/enquire" arrow className="hidden min-h-11! px-5! sm:inline-flex">
            Enquire Now
          </Button>
          <button
            type="button"
            popoverTarget={MENU_ID}
            className="-mr-2 grid h-12 w-12 place-items-center text-fg lg:hidden"
            aria-label="Open menu"
          >
            <Icon name="menu" size={26} />
          </button>
        </div>
      </div>

      <MobileMenu phone={phone} />
    </header>
  );
}

function MobileMenu({ phone }) {
  return (
    <div
      id={MENU_ID}
      popover="auto"
      data-surface="dark"
      className="m-0 h-dvh max-h-none w-full max-w-none border-0 p-0 text-fg backdrop:bg-black/60"
      aria-label="Menu"
    >
      <div className="container-site flex h-full flex-col">
        <div className="flex h-(--header-h) items-center justify-between">
          <Logo className="h-11 w-auto" showSubline={false} title="The Music of Heart" />
          <button
            type="button"
            popoverTarget={MENU_ID}
            popoverTargetAction="hide"
            className="-mr-2 grid h-12 w-12 place-items-center"
            aria-label="Close menu"
          >
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav aria-label="Menu" className="mt-8 flex-1">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `block py-2 font-display text-h2 no-underline ${isActive ? "text-accent" : "text-fg"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-line py-8">
          <Button to="/enquire" arrow className="w-full">
            Enquire now
          </Button>
          {phone ? (
            <Button href={phone.href} variant="secondary" icon="phone" className="w-full tabular">
              Call {phone.display}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
