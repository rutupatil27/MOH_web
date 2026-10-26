import { ENQUIRY_STATUSES, labelFor } from "@moh/shared/constants";

import { Icon } from "../../components/ui/Icon.jsx";

export function AdminPageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line pb-6">
      <div>
        <h1 className="font-display text-h2">{title}</h1>
        {description ? <p className="mt-2 max-w-[60ch] text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

const STATUS_STYLE = {
  new: "border-accent text-accent",
  contacted: "border-line-strong text-fg",
  closed: "border-line text-muted",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-micro font-medium uppercase tracking-[0.08em] ${STATUS_STYLE[status] ?? ""}`}
    >
      {status === "new" ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" /> : null}
      {labelFor(ENQUIRY_STATUSES, status)}
    </span>
  );
}

/** Inline result of an action: a saved confirmation or a readable error. */
export function Notice({ result, success = "Saved." }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p role="status" className="flex items-center gap-2 text-small text-success">
        <Icon name="check" size={18} />
        {result.message ?? success}
      </p>
    );
  }
  return (
    <p role="alert" className="flex items-start gap-2 text-small text-error">
      <Icon name="alert" size={18} className="mt-0.5" />
      {result.error}
    </p>
  );
}

export function FieldError({ result, name, id }) {
  const message = result && !result.ok ? result.fields?.[name] : null;
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

export function Field({ label, name, id = name, hint, result, children, className = "" }) {
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  const invalid = Boolean(result && !result.ok && result.fields?.[name]);
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children({ id, name, "aria-invalid": invalid || undefined, "aria-describedby": [invalid ? errorId : null, hintId].filter(Boolean).join(" ") || undefined })}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-micro text-muted">
          {hint}
        </p>
      ) : null}
      <FieldError result={result} name={name} id={errorId} />
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="font-sans text-h4 font-semibold">{title}</p>
      {children ? <div className="mx-auto mt-3 max-w-[48ch] text-muted">{children}</div> : null}
    </div>
  );
}
