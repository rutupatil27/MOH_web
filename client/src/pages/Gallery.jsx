import { useEffect, useRef, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";

import { Picture, largestUrl } from "../components/media/Picture.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { gallery } from "../lib/data.server.js";
import { breadcrumbJsonLd, pageMeta } from "../lib/seo.js";
import { instagramHandle } from "../lib/site.js";
import { PageHeader } from "../sections/PageHeader.jsx";

export async function loader() {
  return { items: await gallery.listPublishedGallery() };
}

export function meta({ matches }) {
  const root = matches.find((m) => m?.id === "root");
  const siteUrl = (root?.loaderData ?? root?.data)?.siteUrl ?? "";
  return pageMeta({
    matches,
    title: "Gallery",
    description: "Photos from classes and performances at The Music of Heart Music Academy, Nashik Road.",
    path: "/gallery",
    jsonLd: breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/gallery" },
    ]),
  });
}

export default function Gallery() {
  const { items } = useLoaderData();
  const { settings } = useRouteLoaderData("root");
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <PageHeader
        title="Gallery"
        intro="Moments from classes and performances at the academy."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]}
      />

      <section data-surface="dark" className="pb-(--space-section) pt-(--space-block)" aria-label="Photos">
        <div className="container-site">
          {items.length ? (
            // Square crops in a dense grid; every seventh photo takes a 2×2 feature tile for rhythm,
            // unless it has too few pixels to fill one sharply. The full photo opens in the viewer.
            <ul className="grid grid-flow-dense grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 lg:gap-3">
              {items.map((item, i) => {
                const feature = i % 7 === 0 && Math.min(item.image.width, item.image.height) >= FEATURE_MIN_EDGE;
                return (
                  <li key={item.id} className={feature ? "col-span-2 row-span-2" : ""}>
                    <a
                      href={largestUrl(item.image)}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenIndex(i);
                      }}
                      className="group block overflow-hidden"
                      aria-label={`Open photo ${i + 1} of ${items.length}: ${item.altText}`}
                    >
                      <Picture
                        media={item.image}
                        alt={item.altText}
                        aspectRatio="1 / 1"
                        sizes={
                          feature
                            ? "(min-width: 1024px) 44rem, (min-width: 640px) 66vw, 100vw"
                            : "(min-width: 1024px) 22rem, (min-width: 640px) 33vw, 50vw"
                        }
                        imgClassName="transition-[transform,filter] duration-(--dur-slow) ease-(--ease-out-quart) group-hover:scale-[1.03] group-hover:brightness-110"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12">
              <p className="font-display text-h2 lg:col-span-7">Photos from the academy are on the way.</p>
              <div className="lg:col-span-4 lg:col-start-9">
                <p className="text-muted">
                  The gallery fills with real photos from classes and performances as they are added.
                </p>
                {settings?.instagramUrl ? (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener me" className="btn btn-secondary mt-6">
                    <Icon name="instagram" size={18} />
                    {instagramHandle(settings.instagramUrl) ?? "Instagram"}
                    <Icon name="external" size={16} className="opacity-70" />
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      {items.length ? <Lightbox items={items} index={openIndex} onChange={setOpenIndex} /> : null}
    </>
  );
}

/** A 2×2 tile is up to ~780px square on desktop; below this the crop would be visibly stretched. */
const FEATURE_MIN_EDGE = 1000;

/** srcset for a processed image, so phones load a phone-sized file even in the full view. */
function srcSet(media) {
  return [...media.variants]
    .sort((a, b) => a.width - b.width)
    .map((v) => `${v.url} ${v.width}w`)
    .join(", ");
}

const SWIPE_PX = 50;

function Lightbox({ items, index, onChange }) {
  const ref = useRef(null);
  const swipe = useRef(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const many = items.length > 1;
  const go = (delta) => onChange((index + delta + items.length) % items.length);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // Keep the page behind still while a photo is open.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !many) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || !many) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(dx < 0 ? 1 : -1);
  };

  const neighbours = many ? [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]] : [];

  return (
    <dialog
      ref={ref}
      onClose={() => onChange(null)}
      onClick={(e) => e.target === ref.current && onChange(null)}
      data-surface="dark"
      aria-label={item ? item.altText : "Photo"}
      className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-bg p-0 text-fg backdrop:bg-black/85"
    >
      {item ? (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-(--header-h) shrink-0 items-center justify-between">
            <p className="text-small text-muted tabular" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <button type="button" onClick={() => onChange(null)} className="grid h-12 w-12 place-items-center" aria-label="Close photo" autoFocus>
              <Icon name="close" size={26} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-stretch">
            {many ? (
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute inset-y-0 left-0 z-10 hidden w-[clamp(4rem,8vw,7rem)] place-items-center text-muted hover:text-fg md:grid"
                aria-label="Previous photo"
              >
                <Icon name="arrowLeft" size={28} />
              </button>
            ) : null}
            <figure
              className="flex min-h-0 w-full flex-1 touch-pan-y flex-col items-center justify-center px-(--gutter) pb-4 select-none md:px-[clamp(4rem,8vw,7rem)]"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipe.current = null)}
            >
              <img
                key={item.id}
                src={largestUrl(item.image)}
                srcSet={srcSet(item.image)}
                sizes="100vw"
                alt={item.altText}
                width={item.image.width}
                height={item.image.height}
                draggable={false}
                className="max-h-full min-h-0 w-auto max-w-full object-contain"
                style={item.image.placeholder ? { background: `center / contain no-repeat url("${item.image.placeholder}")` } : undefined}
              />
              {item.title ? <figcaption className="mt-4 shrink-0 text-center text-small text-muted">{item.title}</figcaption> : null}
            </figure>
            {many ? (
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute inset-y-0 right-0 z-10 hidden w-[clamp(4rem,8vw,7rem)] place-items-center text-muted hover:text-fg md:grid"
                aria-label="Next photo"
              >
                <Icon name="arrowRight" size={28} />
              </button>
            ) : null}
          </div>

          {many ? (
            <div className="container-site flex shrink-0 justify-between pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden">
              <button type="button" className="btn btn-secondary" onClick={() => go(-1)}>
                <Icon name="arrowLeft" size={18} />
                Previous
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => go(1)}>
                Next
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          ) : null}

          {/* Warm the cache for the photos either side, at the size this screen would pick. */}
          {neighbours.map((n) => (
            <img key={`pre-${n.id}`} src={largestUrl(n.image)} srcSet={srcSet(n.image)} sizes="100vw" alt="" aria-hidden="true" className="hidden" />
          ))}
        </div>
      ) : null}
    </dialog>
  );
}
