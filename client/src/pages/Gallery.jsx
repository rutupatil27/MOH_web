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
            <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {items.map((item, i) => (
                <li key={item.id} className="mb-4 break-inside-avoid">
                  <a
                    href={largestUrl(item.image)}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenIndex(i);
                    }}
                    className="group block"
                    aria-label={`Open photo: ${item.altText}`}
                  >
                    <Picture
                      media={item.image}
                      alt={item.altText}
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                      imgClassName="transition-[filter] duration-(--dur-slow) group-hover:brightness-110"
                    />
                    {item.title ? <span className="mt-3 block text-small text-muted">{item.title}</span> : null}
                  </a>
                </li>
              ))}
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

function Lightbox({ items, index, onChange }) {
  const ref = useRef(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onChange]);

  return (
    <dialog
      ref={ref}
      onClose={() => onChange(null)}
      onClick={(e) => e.target === ref.current && onChange(null)}
      data-surface="dark"
      aria-label={item ? item.altText : "Photo"}
      className="m-0 h-dvh max-h-none w-full max-w-none border-0 p-0 backdrop:bg-black/85"
    >
      {item ? (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-(--header-h) items-center justify-between">
            <p className="text-small text-muted tabular">
              {index + 1} / {items.length}
            </p>
            <button type="button" onClick={() => onChange(null)} className="grid h-12 w-12 place-items-center" aria-label="Close photo" autoFocus>
              <Icon name="close" size={26} />
            </button>
          </div>
          <figure className="container-site flex min-h-0 flex-1 flex-col items-center justify-center pb-6">
            <img
              src={largestUrl(item.image)}
              alt={item.altText}
              width={item.image.width}
              height={item.image.height}
              className="max-h-full min-h-0 w-auto object-contain"
            />
            {item.title ? <figcaption className="mt-4 text-small text-muted">{item.title}</figcaption> : null}
          </figure>
          {items.length > 1 ? (
            <div className="container-site flex justify-between pb-6">
              <button type="button" className="btn btn-secondary" onClick={() => onChange((index - 1 + items.length) % items.length)}>
                <Icon name="arrowLeft" size={18} />
                Previous
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onChange((index + 1) % items.length)}>
                Next
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
