import { useEffect, useId, useRef, useState } from "react";
import { useActionData, useFetcher } from "react-router";

import { CONTACT_METHODS, ENQUIRY_LEVELS, UNDECIDED } from "@moh/shared/constants";
import { formatIndianMobile } from "@moh/shared/phone";

import { Button } from "../ui/Button.jsx";
import { Icon } from "../ui/Icon.jsx";

/**
 * The enquiry form. Posts to the /enquire route action, so it works without
 * JavaScript; with JavaScript it validates in place (same schema as the
 * server) and submits without leaving the page.
 */
export function EnquiryForm({ courses = [], defaultCourse = "", compact = false, phone }) {
  const fetcher = useFetcher({ key: "enquiry" });
  const routeResult = useActionData();
  const result = fetcher.data ?? routeResult;
  const busy = fetcher.state !== "idle";
  const uid = useId();
  const formRef = useRef(null);
  const [clientErrors, setClientErrors] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const serverErrors = result && !result.ok ? (result.errors ?? {}) : {};
  const errors = { ...serverErrors, ...clientErrors };
  const values = result && !result.ok ? (result.values ?? {}) : {};

  useEffect(() => {
    if (!result || result.ok) return;
    const first = formRef.current?.querySelector("[aria-invalid='true']");
    first?.focus();
  }, [result]);

  if (result?.ok) {
    return (
      <div role="status" className="border-t-2 border-accent pt-8" tabIndex={-1} ref={(el) => el?.focus()}>
        <Icon name="check" size={32} className="text-accent" />
        <h3 className="mt-5 font-display text-h3">Thank you{result.name ? `, ${result.name.split(" ")[0]}` : ""}.</h3>
        <p className="mt-4 max-w-[46ch] text-muted">
          Your enquiry has reached the academy. We will contact you on{" "}
          <span className="text-fg tabular">{formatIndianMobile(result.phone ?? "")}</span> soon.
        </p>
        {phone ? (
          <p className="mt-6">
            Prefer to talk now?{" "}
            <a href={phone.href} className="link-accent tabular">
              Call {phone.display}
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  // The shared schema (and Zod) loads on first interaction, keeping it out of every page's initial JavaScript.
  const loadSchema = () => import("@moh/shared/schemas");

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { enquirySchema, fieldErrors } = await loadSchema();
    const parsed = enquirySchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      setClientErrors(fieldErrors(parsed.error));
      requestAnimationFrame(() => formRef.current?.querySelector("[aria-invalid='true']")?.focus());
      return;
    }
    setClientErrors({});
    fetcher.submit(form, { method: "post", action: "/enquire" });
  };

  const clearError = (name) => {
    if (clientErrors[name]) setClientErrors(({ [name]: _, ...rest }) => rest);
  };

  const id = (name) => `${uid}-${name}`;
  const describedBy = (name) => (errors[name] ? `${id(name)}-error` : undefined);
  const selectedCourse = values.course ?? defaultCourse;

  return (
    <fetcher.Form
      method="post"
      action="/enquire"
      ref={formRef}
      noValidate={hydrated}
      onSubmit={onSubmit}
      onFocusCapture={loadSchema}
      className="grid gap-x-6 gap-y-6 sm:grid-cols-2"
    >
      {result?.formError ? (
        <p role="alert" className="flex items-start gap-3 text-error sm:col-span-2">
          <Icon name="alert" size={20} className="mt-0.5" />
          {result.formError}
        </p>
      ) : null}

      <div>
        <label htmlFor={id("name")} className="field-label">
          Student’s name
        </label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={values.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          onChange={() => clearError("name")}
          className="field"
        />
        {errors.name ? (
          <p id={`${id("name")}-error`} className="field-error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id("phone")} className="field-label">
          Mobile number
        </label>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="98765 43210"
          defaultValue={values.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy("phone")}
          onChange={() => clearError("phone")}
          className="field tabular"
        />
        {errors.phone ? (
          <p id={`${id("phone")}-error`} className="field-error">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id("course")} className="field-label">
          Course
        </label>
        <select
          id={id("course")}
          name="course"
          required
          defaultValue={selectedCourse}
          aria-invalid={errors.course ? true : undefined}
          aria-describedby={describedBy("course")}
          onChange={() => clearError("course")}
          className="field"
        >
          <option value="" disabled>
            Choose a course
          </option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          <option value={UNDECIDED}>Not sure yet</option>
        </select>
        {errors.course ? (
          <p id={`${id("course")}-error`} className="field-error">
            {errors.course}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id("level")} className="field-label">
          Level
        </label>
        <select
          id={id("level")}
          name="level"
          required
          defaultValue={values.level ?? ""}
          aria-invalid={errors.level ? true : undefined}
          aria-describedby={describedBy("level")}
          onChange={() => clearError("level")}
          className="field"
        >
          <option value="" disabled>
            Choose a level
          </option>
          {ENQUIRY_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {errors.level ? (
          <p id={`${id("level")}-error`} className="field-error">
            {errors.level}
          </p>
        ) : null}
      </div>

      <fieldset className="sm:col-span-2" aria-describedby={describedBy("preferredContact")}>
        <legend className="field-label">How should we contact you?</legend>
        <div className="flex flex-wrap gap-x-8 gap-y-1">
          {CONTACT_METHODS.map((m, i) => (
            <label key={m.value} className="choice">
              <input
                type="radio"
                name="preferredContact"
                value={m.value}
                required
                defaultChecked={(values.preferredContact ?? "call") === m.value}
                aria-invalid={errors.preferredContact && i === 0 ? true : undefined}
                onChange={() => clearError("preferredContact")}
              />
              {m.label}
            </label>
          ))}
        </div>
        {errors.preferredContact ? (
          <p id={`${id("preferredContact")}-error`} className="field-error">
            {errors.preferredContact}
          </p>
        ) : null}
      </fieldset>

      {!compact ? (
        <div className="sm:col-span-2">
          <label htmlFor={id("message")} className="field-label">
            Anything we should know? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={id("message")}
            name="message"
            maxLength={1000}
            rows={4}
            defaultValue={values.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message")}
            onChange={() => clearError("message")}
            className="field"
          />
          {errors.message ? (
            <p id={`${id("message")}-error`} className="field-error">
              {errors.message}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <Button type="submit" arrow={!busy} disabled={busy} aria-disabled={busy || undefined}>
          {busy ? "Sending…" : "Send enquiry"}
        </Button>
        <p className="text-small text-muted">Your number is used only to contact you about classes.</p>
      </div>
    </fetcher.Form>
  );
}
