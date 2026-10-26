import { useEffect, useRef } from "react";
import { useFetcher, useLoaderData } from "react-router";

import { Picture } from "../../components/media/Picture.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { act, api, load } from "../api.js";
import { AdminPageHeader, EmptyState, Field, Notice } from "../components/ui.jsx";

export async function clientLoader() {
  return load("/gallery");
}

export async function clientAction({ request }) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "upload") {
    const body = new FormData();
    for (const key of ["image", "altText", "title", "category"]) if (form.get(key) !== null) body.set(key, form.get(key));
    body.set("published", form.get("published") === "on" ? "true" : "false");
    const result = await act(() => api("/gallery", { method: "POST", form: body }));
    return { ...result, intent, message: result.ok ? "Photo added." : undefined };
  }
  if (intent === "update") {
    const id = form.get("id");
    const result = await act(() =>
      api(`/gallery/${id}`, {
        method: "PATCH",
        body: {
          altText: form.get("altText"),
          title: form.get("title"),
          category: form.get("category"),
          published: form.get("published") === "on",
          sortOrder: form.get("sortOrder"),
        },
      }),
    );
    return { ...result, intent, id };
  }
  if (intent === "delete") {
    const result = await act(() => api(`/gallery/${form.get("id")}`, { method: "DELETE" }));
    return { ...result, intent, message: result.ok ? "Photo deleted." : undefined };
  }
  if (intent === "reorder") {
    const result = await act(() => api("/gallery/reorder", { method: "POST", body: { ids: JSON.parse(form.get("ids")) } }));
    return { ...result, intent, message: result.ok ? "Order saved." : undefined };
  }
  return { ok: false, error: "Unknown action." };
}

export default function Gallery() {
  const { items } = useLoaderData();
  const ids = items.map((i) => i.id);

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Real photos from the academy only. Every photo needs a short description (alt text) for people using screen readers."
      />
      <UploadForm />
      <section className="mt-12" aria-labelledby="photos-title">
        <h2 id="photos-title" className="font-sans text-h4 font-semibold">
          Photos <span className="text-muted tabular">({items.length})</span>
        </h2>
        {items.length ? (
          <ol className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, i) => (
              <PhotoCard key={item.id} item={item} index={i} ids={ids} />
            ))}
          </ol>
        ) : (
          <div className="mt-4">
            <EmptyState title="No photos yet">Uploaded photos appear on the Gallery page and in the homepage preview.</EmptyState>
          </div>
        )}
      </section>
    </>
  );
}

function UploadForm() {
  const fetcher = useFetcher();
  const formRef = useRef(null);
  const busy = fetcher.state !== "idle";
  const result = fetcher.data?.intent === "upload" ? fetcher.data : null;

  useEffect(() => {
    if (fetcher.state === "idle" && result?.ok) formRef.current?.reset();
  }, [fetcher.state, result]);

  return (
    <section className="mt-8 border border-line bg-raised p-5 sm:p-6" aria-labelledby="upload-title">
      <h2 id="upload-title" className="font-sans text-h4 font-semibold">
        Add a photo
      </h2>
      <fetcher.Form ref={formRef} method="post" encType="multipart/form-data" className="mt-5 grid gap-5 md:grid-cols-2" noValidate>
        <input type="hidden" name="intent" value="upload" />
        <Field label="Photo" name="image" hint="JPEG, PNG, WebP or HEIC, up to 12 MB." result={result} className="md:col-span-2">
          {(p) => <input {...p} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required className="block text-small" />}
        </Field>
        <Field label="Alt text" name="altText" hint="Describe what the photo shows, e.g. “Student practising guitar at the academy”." result={result}>
          {(p) => <input {...p} required maxLength={200} className="field" />}
        </Field>
        <Field label="Caption (optional)" name="title" result={result}>
          {(p) => <input {...p} maxLength={120} className="field" />}
        </Field>
        <Field label="Category (optional)" name="category" hint="e.g. Classes, Performances." result={result}>
          {(p) => <input {...p} maxLength={40} className="field" />}
        </Field>
        <div className="flex items-end">
          <label className="choice">
            <input type="checkbox" name="published" defaultChecked />
            Show on the website
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            <Icon name="upload" size={18} />
            {busy ? "Uploading…" : "Upload photo"}
          </button>
          {!busy ? <Notice result={result} /> : null}
        </div>
      </fetcher.Form>
    </section>
  );
}

function PhotoCard({ item, index, ids }) {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const result = fetcher.data;

  const move = (delta) => {
    const next = [...ids];
    const [id] = next.splice(index, 1);
    next.splice(index + delta, 0, id);
    fetcher.submit({ intent: "reorder", ids: JSON.stringify(next) }, { method: "post" });
  };

  return (
    <li className="flex flex-col border border-line bg-raised">
      <div className="relative">
        <Picture media={item.image} alt={item.altText} sizes="(min-width: 1280px) 22rem, (min-width: 768px) 45vw, 100vw" className="aspect-[4/3]" />
        {!item.published ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-xs bg-ink px-2 py-1 text-micro text-paper">
            <Icon name="eyeOff" size={14} />
            Hidden
          </span>
        ) : null}
      </div>
      <fetcher.Form method="post" className="flex flex-1 flex-col gap-4 p-4" noValidate>
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="sortOrder" value={item.sortOrder} />
        <Field label="Alt text" name="altText" id={`alt-${item.id}`} result={result}>
          {(p) => <input {...p} defaultValue={item.altText} required maxLength={200} className="field min-h-11" />}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`title-${item.id}`} className="field-label">
              Caption
            </label>
            <input id={`title-${item.id}`} name="title" defaultValue={item.title} maxLength={120} className="field min-h-11" />
          </div>
          <div>
            <label htmlFor={`cat-${item.id}`} className="field-label">
              Category
            </label>
            <input id={`cat-${item.id}`} name="category" defaultValue={item.category} maxLength={40} className="field min-h-11" />
          </div>
        </div>
        <label className="choice">
          <input type="checkbox" name="published" defaultChecked={item.published} />
          Show on the website
        </label>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <button type="submit" className="btn btn-secondary min-h-10 px-4" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-muted hover:text-fg disabled:opacity-30"
            onClick={() => move(-1)}
            disabled={index === 0 || busy}
            aria-label="Move earlier"
          >
            <Icon name="chevronUp" size={18} />
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-muted hover:text-fg disabled:opacity-30"
            onClick={() => move(1)}
            disabled={index === ids.length - 1 || busy}
            aria-label="Move later"
          >
            <Icon name="chevronDown" size={18} />
          </button>
          <button
            type="button"
            className="ml-auto inline-flex h-10 items-center gap-1.5 px-2 text-small text-error disabled:opacity-40"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Delete this photo from the website? This cannot be undone.")) {
                fetcher.submit({ intent: "delete", id: item.id }, { method: "post" });
              }
            }}
          >
            <Icon name="trash" size={16} />
            Delete
          </button>
        </div>
        {!busy ? <Notice result={result} /> : null}
      </fetcher.Form>
    </li>
  );
}
