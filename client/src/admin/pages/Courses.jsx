import { Link, useFetcher, useLoaderData } from "react-router";

import { Icon } from "../../components/ui/Icon.jsx";
import { act, api, load } from "../api.js";
import { AdminPageHeader, EmptyState, Notice } from "../components/ui.jsx";

export async function clientLoader() {
  return load("/courses");
}

export async function clientAction({ request }) {
  const form = await request.formData();
  const intent = form.get("intent");
  if (intent === "reorder") {
    return act(() => api("/courses/reorder", { method: "POST", body: { ids: JSON.parse(form.get("ids")) } }));
  }
  if (intent === "publish") {
    const course = JSON.parse(form.get("course"));
    return act(() => api(`/courses/${course.id}`, { method: "PATCH", body: { ...course, published: form.get("published") === "true" } }));
  }
  return { ok: false, error: "Unknown action." };
}

export default function Courses() {
  const { courses } = useLoaderData();
  const fetcher = useFetcher();
  const ids = courses.map((c) => c.id);

  const move = (index, delta) => {
    const next = [...ids];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    fetcher.submit({ intent: "reorder", ids: JSON.stringify(next) }, { method: "post" });
  };

  return (
    <>
      <AdminPageHeader
        title="Courses"
        description="What appears on the Courses pages. Only published courses are shown on the website, in this order."
        actions={
          <Link to="/admin/courses/new" className="btn btn-primary">
            <Icon name="plus" size={18} />
            New course
          </Link>
        }
      />

      <div className="mt-4 min-h-6">
        <Notice result={fetcher.state === "idle" ? fetcher.data : null} />
      </div>

      {courses.length ? (
        <ol className="mt-2 border-t border-line">
          {courses.map((course, i) => (
            <li key={course.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line py-4">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || fetcher.state !== "idle"}
                  className="grid h-7 w-8 place-items-center text-muted hover:text-fg disabled:opacity-30"
                  aria-label={`Move ${course.name} up`}
                >
                  <Icon name="chevronUp" size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === courses.length - 1 || fetcher.state !== "idle"}
                  className="grid h-7 w-8 place-items-center text-muted hover:text-fg disabled:opacity-30"
                  aria-label={`Move ${course.name} down`}
                >
                  <Icon name="chevronDown" size={18} />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-h4 font-semibold">{course.name}</p>
                <p className="truncate text-small text-muted">/courses/{course.slug} · {course.levels.length} level{course.levels.length === 1 ? "" : "s"}</p>
              </div>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="publish" />
                <input type="hidden" name="course" value={JSON.stringify(course)} />
                <input type="hidden" name="published" value={String(!course.published)} />
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 rounded-xs border px-3 py-1.5 text-small ${course.published ? "border-success text-success" : "border-line-strong text-muted"}`}
                  aria-label={`${course.name} is ${course.published ? "published" : "hidden"}. ${course.published ? "Hide" : "Publish"} it`}
                >
                  <Icon name={course.published ? "eye" : "eyeOff"} size={16} />
                  {course.published ? "Published" : "Hidden"}
                </button>
              </fetcher.Form>
              <Link to={`/admin/courses/${course.id}`} className="btn btn-secondary min-h-10 px-4">
                Edit
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState title="No courses">Create a course to show it on the website.</EmptyState>
      )}
    </>
  );
}
