import { useRef, useState } from "react";
import { Form, Link, redirect, useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";

import { LEVELS } from "@moh/shared/constants";

import { Picture } from "../../components/media/Picture.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { act, api, load } from "../api.js";
import { Field, Notice } from "../components/ui.jsx";

export async function clientLoader({ params }) {
  if (!params.id) return { course: null };
  return load(`/courses/${params.id}`);
}

function courseFromForm(form) {
  const levels = LEVELS.filter((l) => form.get(`level-${l.value}-enabled`) === "on").map((l) => ({
    level: l.value,
    summary: String(form.get(`level-${l.value}-summary`) ?? ""),
    points: String(form.get(`level-${l.value}-points`) ?? "")
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean),
  }));
  return {
    name: form.get("name"),
    slug: form.get("slug"),
    shortDescription: form.get("shortDescription"),
    description: form.get("description"),
    levels,
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
    sortOrder: form.get("sortOrder") || undefined,
  };
}

/** Field errors arrive as "levels.0.summary"; show them against the right level. */
function mapLevelErrors(result, course) {
  if (!result?.fields) return result;
  const fields = { ...result.fields };
  for (const [key, message] of Object.entries(result.fields)) {
    const m = /^levels\.(\d+)\.(\w+)/.exec(key);
    if (m) fields[`level-${course.levels[Number(m[1])]?.level}-${m[2]}`] = message;
  }
  return { ...result, fields };
}

export async function clientAction({ request, params }) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "delete") {
    const result = await act(() => api(`/courses/${params.id}`, { method: "DELETE" }));
    return result.ok ? redirect("/admin/courses") : result;
  }
  if (intent === "upload-image") {
    const body = new FormData();
    body.set("image", form.get("image"));
    return act(() => api(`/courses/${params.id}/image`, { method: "POST", form: body }));
  }
  if (intent === "remove-image") {
    return act(() => api(`/courses/${params.id}/image`, { method: "DELETE" }));
  }

  const course = courseFromForm(form);
  if (!params.id) {
    const result = await act(() => api("/courses", { method: "POST", body: course }));
    return result.ok ? redirect(`/admin/courses/${result.course.id}?created=1`) : mapLevelErrors(result, course);
  }
  const result = await act(() => api(`/courses/${params.id}`, { method: "PATCH", body: course }));
  return mapLevelErrors(result, course);
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CourseEdit() {
  const { course: loaded } = useLoaderData();
  const result = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting" && navigation.formData?.get("intent") == null;
  const isNew = !loaded;
  const course = result?.course ?? loaded;
  const [slug, setSlug] = useState(loaded?.slug ?? "");
  const slugTouched = useRef(Boolean(loaded));

  const levelOf = (value) => course?.levels?.find((l) => l.level === value);

  return (
    <>
      <Link to="/admin/courses" className="inline-flex items-center gap-2 text-small text-muted no-underline hover:text-fg">
        <Icon name="arrowLeft" size={16} />
        All courses
      </Link>
      <h1 className="mt-4 border-b border-line pb-6 font-display text-h2">{isNew ? "New course" : `Edit ${loaded.name}`}</h1>

      <Form method="post" className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-[1fr_20rem]" noValidate>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Course name" name="name" result={result}>
              {(p) => (
                <input
                  {...p}
                  defaultValue={course?.name}
                  required
                  className="field"
                  onChange={(e) => {
                    if (!slugTouched.current) setSlug(slugify(e.target.value));
                  }}
                />
              )}
            </Field>
            <Field label="Web address" name="slug" hint={`themusicofheart.com/courses/${slug || "…"}`} result={result}>
              {(p) => (
                <input
                  {...p}
                  value={slug}
                  onChange={(e) => {
                    slugTouched.current = true;
                    setSlug(e.target.value);
                  }}
                  required
                  className="field"
                />
              )}
            </Field>
          </div>
          <Field label="Short description" name="shortDescription" hint="One sentence. Shown in course lists and search results." result={result}>
            {(p) => <input {...p} defaultValue={course?.shortDescription} maxLength={160} required className="field" />}
          </Field>
          <Field label="Description" name="description" hint="Leave a blank line between paragraphs." result={result}>
            {(p) => <textarea {...p} defaultValue={course?.description} rows={6} className="field" />}
          </Field>

          <fieldset className="space-y-6">
            <legend className="font-sans text-h4 font-semibold">Levels</legend>
            {result?.fields?.levels ? <p className="field-error">{result.fields.levels}</p> : null}
            {LEVELS.map((l) => {
              const existing = levelOf(l.value);
              return (
                <div key={l.value} className="border border-line bg-raised p-5">
                  <label className="choice font-medium">
                    <input type="checkbox" name={`level-${l.value}-enabled`} defaultChecked={isNew || Boolean(existing)} />
                    Offer {l.label}
                  </label>
                  <div className="mt-4 grid gap-5">
                    <Field label={`${l.label} summary`} name={`level-${l.value}-summary`} result={result}>
                      {(p) => <textarea {...p} rows={2} defaultValue={existing?.summary} className="field min-h-0" />}
                    </Field>
                    <Field label="Points" name={`level-${l.value}-points`} hint="One per line." result={result}>
                      {(p) => <textarea {...p} rows={4} defaultValue={existing?.points?.join("\n")} className="field" />}
                    </Field>
                  </div>
                </div>
              );
            })}
          </fieldset>
        </div>

        <aside className="space-y-6">
          <div className="space-y-2 border border-line bg-raised p-5">
            <label className="choice">
              <input type="checkbox" name="published" defaultChecked={course?.published ?? false} />
              Published on the website
            </label>
            <label className="choice">
              <input type="checkbox" name="featured" defaultChecked={course?.featured ?? true} />
              Featured
            </label>
            <input type="hidden" name="sortOrder" value={course?.sortOrder ?? ""} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : isNew ? "Create course" : "Save changes"}
            </button>
            {!busy ? <Notice result={result} /> : null}
          </div>
        </aside>
      </Form>

      {!isNew ? <CourseImage course={course} /> : null}
      {!isNew ? <DangerZone name={loaded.name} /> : null}
    </>
  );
}

function CourseImage({ course }) {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const image = fetcher.data?.course?.image ?? (fetcher.data?.course ? null : course.image);

  return (
    <section className="mt-14 border-t border-line pt-8" aria-labelledby="image-title">
      <h2 id="image-title" className="font-sans text-h4 font-semibold">
        Course photo
      </h2>
      <p className="mt-1 text-small text-muted">Optional. A real photo from the academy, shown on the course page.</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-[16rem_1fr]">
        {image ? (
          <Picture media={image} alt="" sizes="16rem" className="border border-line" />
        ) : (
          <div className="grid aspect-[4/3] place-items-center border border-dashed border-line-strong text-small text-muted">No photo</div>
        )}
        <div className="space-y-4">
          <fetcher.Form method="post" encType="multipart/form-data" className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="intent" value="upload-image" />
            <div>
              <label htmlFor="course-image" className="field-label">
                Upload a photo
              </label>
              <input id="course-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required className="text-small" />
            </div>
            <button type="submit" className="btn btn-secondary min-h-11" disabled={busy}>
              <Icon name="upload" size={18} />
              {busy ? "Uploading…" : "Upload"}
            </button>
          </fetcher.Form>
          {image ? (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="remove-image" />
              <button type="submit" className="inline-flex items-center gap-2 text-small text-error" disabled={busy}>
                <Icon name="trash" size={16} />
                Remove photo
              </button>
            </fetcher.Form>
          ) : null}
          {!busy ? <Notice result={fetcher.data} /> : null}
        </div>
      </div>
    </section>
  );
}

function DangerZone({ name }) {
  return (
    <section className="mt-14 border-t border-line pt-8" aria-labelledby="danger-title">
      <h2 id="danger-title" className="font-sans text-h4 font-semibold">
        Delete course
      </h2>
      <p className="mt-1 text-small text-muted">Removes {name} and its page from the website. This cannot be undone — hiding it is usually better.</p>
      <Form
        method="post"
        className="mt-4"
        onSubmit={(e) => {
          if (!window.confirm(`Delete ${name}? This cannot be undone.`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="intent" value="delete" />
        <button type="submit" className="btn btn-secondary min-h-11 text-error">
          <Icon name="trash" size={18} />
          Delete {name}
        </button>
      </Form>
    </section>
  );
}
