import { Link } from "react-router";

import { Icon } from "./Icon.jsx";

/**
 * The one button. Renders a router Link (to), an anchor (href) or a button.
 * Colour comes from the surrounding data-surface, never from the caller.
 */
export function Button({ variant = "primary", to, href, icon, arrow = false, children, className = "", ...rest }) {
  const classes = `btn btn-${variant} ${className}`;
  const content = (
    <>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {arrow ? <Icon name="arrowRight" size={18} className="btn-arrow" /> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
