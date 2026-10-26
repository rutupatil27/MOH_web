import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";

import { Icon } from "../../components/ui/Icon.jsx";
import { Logo } from "../../components/ui/Logo.jsx";
import { ApiError, api } from "../api.js";

export async function clientLoader() {
  try {
    await api("/me");
    return redirect("/admin");
  } catch {
    return null;
  }
}

export async function clientAction({ request }) {
  const form = await request.formData();
  try {
    await api("/login", { method: "POST", body: { email: form.get("email"), password: form.get("password") } });
  } catch (error) {
    // Here a 401 means wrong credentials, not an expired session.
    if (error instanceof ApiError) return { ok: false, error: error.message, fields: error.fields };
    return { ok: false, error: "Could not reach the server. Check your connection and try again." };
  }
  const next = new URL(request.url).searchParams.get("next");
  return redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export function meta() {
  return [{ title: "Sign in | The Music of Heart admin" }, { name: "robots", content: "noindex, nofollow" }];
}

export function HydrateFallback() {
  return <div data-surface="dark" className="min-h-dvh" />;
}

export default function Login() {
  const result = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  const [show, setShow] = useState(false);
  const fields = result?.fields ?? {};

  return (
    <main data-surface="dark" className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Logo className="h-16 w-auto" />
        <h1 className="mt-12 font-display text-h3">Admin sign in</h1>
        <p className="mt-2 text-small text-muted">For the academy’s administrator only.</p>

        <Form method="post" className="mt-8 space-y-5" noValidate>
          {result && !result.ok && !Object.keys(fields).length ? (
            <p role="alert" className="flex items-start gap-2 text-small text-error">
              <Icon name="alert" size={18} className="mt-0.5" />
              {result.error}
            </p>
          ) : null}
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="field"
              aria-invalid={fields.email ? true : undefined}
              aria-describedby={fields.email ? "email-error" : undefined}
            />
            {fields.email ? (
              <p id="email-error" className="field-error">
                {fields.email}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                className="field pr-12"
                aria-invalid={fields.password ? true : undefined}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted hover:text-fg"
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
              >
                <Icon name={show ? "eyeOff" : "eye"} size={19} />
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </Form>
        <p className="mt-8 text-micro text-muted">
          Forgotten the password? It is reset from the server with <code>npm run create-admin</code>.
        </p>
      </div>
    </main>
  );
}
