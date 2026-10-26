import { redirect } from "react-router";

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message || "Something went wrong.");
    this.status = status;
    this.fields = fields ?? {};
  }
}

/** Admin REST client. Same-origin cookie session; JSON in and out, FormData for uploads. */
export async function api(path, { method = "GET", body, form } = {}) {
  const res = await fetch(`/api/admin${path}`, {
    method,
    credentials: "same-origin",
    headers: body !== undefined ? { "Content-Type": "application/json", Accept: "application/json" } : { Accept: "application/json" },
    body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.error, json.fields);
  return json;
}

/** For clientLoaders: a lapsed session goes back to the sign-in page. */
export async function load(path) {
  try {
    return await api(path);
  } catch (error) {
    if (error.status === 401) throw redirect(`/admin/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    throw error;
  }
}

/** For clientActions: field errors and messages come back as data, a lapsed session redirects. */
export async function act(fn) {
  try {
    return { ok: true, ...(await fn()) };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) throw redirect("/admin/login");
      return { ok: false, error: error.message, fields: error.fields };
    }
    return { ok: false, error: "Could not reach the server. Check your connection and try again." };
  }
}

export function formatDate(iso, { time = true } = {}) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}
