import { SITE_IMAGES } from "../../lib/siteImages.js";
import { Picture } from "./Picture.jsx";

/**
 * An owner-supplied image by name (files in assets/source, built with `npm run images`).
 * Tries each name in order; until one exists it renders a quiet panel of the same
 * shape, so layouts hold and nothing is faked.
 */
export function SiteImage({ name, alt, sizes, priority = false, className = "", imgClassName = "", aspectRatio, fit = "cover", placeholder = true, fallbackLabel }) {
  const names = [].concat(name);
  const media = names.map((n) => SITE_IMAGES[n]).find(Boolean);
  if (media) {
    return (
      <Picture
        media={media}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={className}
        imgClassName={imgClassName}
        aspectRatio={aspectRatio}
        fit={fit}
        placeholder={placeholder}
      />
    );
  }
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={`relative grid place-items-end overflow-hidden bg-charcoal ${className}`}
      style={{ aspectRatio }}
    >
      {fallbackLabel ? (
        <span aria-hidden="true" className="m-5 font-display text-h3 text-graphite">
          {fallbackLabel}
        </span>
      ) : null}
    </div>
  );
}

export const hasSiteImage = (...names) => names.some((n) => Boolean(SITE_IMAGES[n]));
