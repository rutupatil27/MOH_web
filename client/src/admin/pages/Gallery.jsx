import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useRevalidator } from "react-router";

import { DEFAULT_PHOTO_ALT, PHOTO_SHARP_MIN_EDGE } from "@moh/shared/constants";

import { Picture } from "../../components/media/Picture.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { ApiError, act, api, load } from "../api.js";
import { PHOTO_ACCEPT, prepareImage } from "../prepareImage.js";
import { AdminPageHeader, EmptyState, Field, Notice } from "../components/ui.jsx";

export async function clientLoader() {
  return load("/gallery");
}

export async function clientAction({ request }) {
  const form = await request.formData();
  const intent = form.get("intent");

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
        description="Real photos from the academy only. Each photo gets a short description for people using screen readers — a standard one is filled in for you."
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

const STATUS_TEXT = { waiting: "Waiting", preparing: "Preparing…", uploading: "Uploading…", done: "Added" };

const isLowRes = (size) => Boolean(size?.width) && Math.min(size.width, size.height) < PHOTO_SHARP_MIN_EDGE;

/**
 * Many photos in one go. Each is prepared in the browser (resized, HEIC → JPEG)
 * and uploaded on its own request, one after another, so a failure affects only
 * that photo and the server never holds more than one image in memory.
 * The shared details apply to every photo; each can be refined in the list below.
 */
function UploadForm() {
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const revalidator = useRevalidator();
  const [queue, setQueue] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);

  // Thumbnails use object URLs: each is released when its photo leaves the list, the rest when the page closes.
  const previews = useRef(new Set());
  useEffect(() => () => previews.current.forEach((url) => URL.revokeObjectURL(url)), []);
  const release = (items) =>
    items.forEach((q) => {
      URL.revokeObjectURL(q.preview);
      previews.current.delete(q.preview);
    });

  const patch = (id, change) => setQueue((list) => list.map((q) => (q.id === id ? { ...q, ...change } : q)));
  const remove = (item) => {
    release([item]);
    setQueue((list) => list.filter((q) => q.id !== item.id));
  };

  const addFiles = (files) => {
    const added = [...files].map((file) => {
      const preview = URL.createObjectURL(file);
      previews.current.add(preview);
      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview,
        status: "waiting",
        error: null,
      };
    });
    release(queue.filter((q) => q.status === "done"));
    setQueue((list) => [...list.filter((q) => q.status !== "done"), ...added]);
    setSummary(null);
    setErrors(({ image: _, ...rest }) => rest);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const pending = queue.filter((q) => q.status !== "done");
    const values = Object.fromEntries(new FormData(formRef.current));
    const details = { altText: values.altText, title: values.title, category: values.category, published: values.published === "on" };

    const { galleryItemSchema, fieldErrors } = await import("@moh/shared/schemas");
    const parsed = galleryItemSchema.safeParse(details);
    const nextErrors = parsed.success ? {} : fieldErrors(parsed.error);
    if (!pending.length) nextErrors.image = "Choose at least one photo.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector("[aria-invalid='true']")?.focus());
      return;
    }

    setBusy(true);
    setSummary(null);
    let added = 0;
    // New photos go to the top of the gallery, so upload in reverse to keep the chosen order.
    for (const item of [...pending].reverse()) {
      try {
        patch(item.id, { status: "preparing", error: null });
        const file = await prepareImage(item.file);
        patch(item.id, { status: "uploading" });
        const body = new FormData();
        body.set("image", file);
        body.set("altText", parsed.data.altText);
        body.set("title", parsed.data.title);
        body.set("category", parsed.data.category);
        body.set("published", String(parsed.data.published));
        await api("/gallery", { method: "POST", form: body });
        patch(item.id, { status: "done" });
        added += 1;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          window.location.assign("/admin/login?next=/admin/gallery");
          return;
        }
        const message =
          error instanceof ApiError
            ? (Object.values(error.fields ?? {})[0] ?? error.message)
            : "Could not reach the server. Check your connection and try again.";
        patch(item.id, { status: "failed", error: message });
      }
    }
    setBusy(false);
    const failed = pending.length - added;
    setSummary({
      ok: failed === 0,
      message: `${added} ${added === 1 ? "photo" : "photos"} added.`,
      error: `${added} added, ${failed} could not be uploaded — see the marked ${failed === 1 ? "photo" : "photos"} below. Press Upload again to retry.`,
    });
    if (added) revalidator.revalidate();
  };

  const pendingCount = queue.filter((q) => q.status !== "done").length;
  const lowResCount = queue.filter((q) => q.status !== "done" && isLowRes(q.size)).length;
  const doneCount = queue.length - pendingCount;
  const result = Object.keys(errors).length ? { ok: false, fields: errors } : null;

  return (
    <section className="mt-8 border border-line bg-raised p-5 sm:p-6" aria-labelledby="upload-title">
      <h2 id="upload-title" className="font-sans text-h4 font-semibold">
        Add photos
      </h2>
      <form ref={formRef} onSubmit={onSubmit} className="mt-5 grid gap-5 md:grid-cols-2" noValidate>
        <Field
          label="Photos"
          name="image"
          id="gallery-files"
          hint="Choose one or many at once. Any size works — large photos are resized before uploading."
          result={result}
          className="md:col-span-2"
        >
          {(p) => (
            <input
              {...p}
              ref={fileRef}
              name={undefined}
              type="file"
              multiple
              accept={PHOTO_ACCEPT}
              disabled={busy}
              onChange={(e) => addFiles(e.target.files)}
              className="block text-small"
            />
          )}
        </Field>

        {queue.length ? (
          <div className="md:col-span-2">
            <p className="text-small text-muted tabular" aria-live="polite">
              {busy
                ? `Uploading ${Math.min(doneCount + 1, queue.length)} of ${queue.length}…`
                : `${queue.length} ${queue.length === 1 ? "photo" : "photos"} chosen`}
            </p>
            {lowResCount > 0 && !busy ? (
              <p role="status" className="mt-2 flex max-w-[70ch] items-start gap-2 text-small text-error">
                <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
                {lowResCount === 1 ? "1 photo is" : `${lowResCount} photos are`} too small to look sharp on the website — probably a
                preview or a saved thumbnail. Upload the original photo from the phone or camera if you can.
              </p>
            ) : null}
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {queue.map((q) => (
                <li key={q.id}>
                  <div className="relative">
                    <img
                      src={q.preview}
                      alt=""
                      onLoad={(e) => patch(q.id, { size: { width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight } })}
                      className={`aspect-square w-full bg-line object-cover ${q.status === "done" ? "opacity-50" : ""}`}
                    />
                    <span
                      className={`absolute inset-x-0 bottom-0 truncate px-1.5 py-1 text-micro ${q.status === "failed" ? "bg-error text-paper" : "bg-ink/80 text-paper"}`}
                      title={q.error ?? q.file.name}
                    >
                      {q.status === "done" ? <Icon name="check" size={12} className="mr-1 inline-block align-[-2px]" /> : null}
                      {q.status === "failed" ? "Failed" : q.status === "waiting" ? q.file.name : STATUS_TEXT[q.status]}
                    </span>
                    {!busy && q.status !== "done" ? (
                      <button
                        type="button"
                        onClick={() => remove(q)}
                        className="absolute top-1 right-1 grid h-8 w-8 place-items-center bg-ink/80 text-paper hover:bg-ink"
                        aria-label={`Remove ${q.file.name}`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    ) : null}
                  </div>
                  {q.error ? <p className="mt-1 text-micro text-error">{q.error}</p> : null}
                  {!q.error && isLowRes(q.size) ? (
                    <p className="mt-1 text-micro text-error">
                      Low resolution ({q.size.width} × {q.size.height}) — will look blurry
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Field
          label="Description (optional)"
          name="altText"
          id="gallery-altText"
          hint="Leave blank to use the standard description shown. Anything you type applies to every photo in this upload."
          result={result}
        >
          {(p) => <input {...p} maxLength={200} placeholder={DEFAULT_PHOTO_ALT} className="field" disabled={busy} />}
        </Field>
        <Field label="Caption (optional)" name="title" id="gallery-title" result={result}>
          {(p) => <input {...p} maxLength={120} className="field" disabled={busy} />}
        </Field>
        <Field label="Category (optional)" name="category" id="gallery-category" hint="e.g. Classes, Performances." result={result}>
          {(p) => <input {...p} maxLength={40} className="field" disabled={busy} />}
        </Field>
        <div className="flex items-end">
          <label className="choice">
            <input type="checkbox" name="published" defaultChecked disabled={busy} />
            Show on the website
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            <Icon name="upload" size={18} />
            {busy ? "Uploading…" : pendingCount === 1 ? "Upload photo" : pendingCount ? `Upload ${pendingCount} photos` : "Upload photos"}
          </button>
          {!busy ? <Notice result={summary} /> : null}
        </div>
      </form>
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
        {isLowRes(item.image) ? (
          <span
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-xs bg-ink px-2 py-1 text-micro text-paper"
            title="Too few pixels to look sharp on the website. Replace it with the original photo if you can."
          >
            <Icon name="alert" size={14} />
            Low resolution · {item.image.width} × {item.image.height}
          </span>
        ) : null}
      </div>
      <fetcher.Form method="post" className="flex flex-1 flex-col gap-4 p-4" noValidate>
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="sortOrder" value={item.sortOrder} />
        <Field label="Description" name="altText" id={`alt-${item.id}`} result={result}>
          {(p) => <input {...p} defaultValue={item.altText} maxLength={200} placeholder={DEFAULT_PHOTO_ALT} className="field min-h-11" />}
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
