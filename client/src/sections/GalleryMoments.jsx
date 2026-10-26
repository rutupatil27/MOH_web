import { useState } from "react";

import { Picture } from "../components/media/Picture.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Staff } from "../components/ui/Decor.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { instagramHandle } from "../lib/site.js";

/**
 * Real academy photos only (uploaded in Admin → Gallery). Filters come from the
 * categories the admin actually used; with no photos it points to Instagram.
 */
export function GalleryMoments({ photos = [], settings }) {
  const categories = [...new Set(photos.map((p) => p.category).filter(Boolean))];
  const [active, setActive] = useState("All");
  const shown = (active === "All" ? photos : photos.filter((p) => p.category === active)).slice(0, 5);
  const handle = instagramHandle(settings?.instagramUrl);

  return (
    <section data-surface="light" className="section relative overflow-hidden" aria-labelledby="moments-title">
      <Staff className="pointer-events-none absolute top-10 right-0 hidden h-28 w-[42%] text-accent lg:block" />
      <div className="container-site">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="moments-title" className="font-display text-h2">
              Moments <Icon name="note" size={40} className="inline-block align-middle text-accent" />
              <br />
              <span className="lg:whitespace-nowrap">That Make Music Live</span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-muted">
              A glimpse into our classes, student performances and musical journey at The Music of Heart.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            {photos.length && categories.length ? (
              <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active === c}
                    onClick={() => setActive(c)}
                    className={`rounded-xs border px-3 py-1.5 text-small ${active === c ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}
            {photos.length ? (
              <Button to="/gallery" arrow>
                View Gallery
              </Button>
            ) : null}
          </div>
        </div>

        {shown.length ? (
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
            {shown.map((photo, i) => (
              <li key={photo.id} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
                <Picture media={photo.image} alt={photo.altText} sizes="(min-width: 768px) 20vw, 50vw" aspectRatio="4 / 5" className="rounded-xs" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[46ch] text-lead">Photos from the academy are on the way. Until then, follow along on Instagram.</p>
            {settings?.instagramUrl ? (
              <a href={settings.instagramUrl} target="_blank" rel="noopener me" className="btn btn-primary">
                <Icon name="instagram" size={18} />
                {handle ?? "Instagram"}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
