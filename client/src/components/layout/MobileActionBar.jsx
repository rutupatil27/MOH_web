import { Link, useLocation } from "react-router";

import { phoneOf } from "../../lib/site.js";
import { Icon } from "../ui/Icon.jsx";

/** Phones only: calling and enquiring stay one tap away on every page. */
export function MobileActionBar({ settings }) {
  const phone = phoneOf(settings);
  const { pathname } = useLocation();
  const onEnquire = pathname.startsWith("/enquire");

  return (
    <nav
      aria-label="Call or enquire"
      data-surface="dark"
      className="fixed inset-x-0 bottom-0 z-(--z-mobile-bar) grid h-(--mobile-bar-h) grid-cols-2 border-t border-line md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {phone ? (
        <a href={phone.href} className="flex items-center justify-center gap-2.5 border-r border-line font-medium no-underline">
          <Icon name="phone" size={19} />
          Call
        </a>
      ) : (
        <span />
      )}
      {onEnquire ? (
        <a href="#enquiry-form" className="flex items-center justify-center gap-2 bg-btn font-medium text-btn-fg no-underline">
          Fill the form
        </a>
      ) : (
        <Link to="/enquire" className="flex items-center justify-center gap-2 bg-btn font-medium text-btn-fg no-underline">
          Enquire
          <Icon name="arrowRight" size={18} />
        </Link>
      )}
    </nav>
  );
}
