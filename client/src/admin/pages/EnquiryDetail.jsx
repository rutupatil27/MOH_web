import { Link, useFetcher, useLoaderData } from "react-router";

import { CONTACT_METHODS, ENQUIRY_LEVELS, ENQUIRY_STATUSES, labelFor } from "@moh/shared/constants";
import { formatIndianMobile } from "@moh/shared/phone";

import { Icon } from "../../components/ui/Icon.jsx";
import { act, api, formatDate, load } from "../api.js";
import { Notice, StatusBadge } from "../components/ui.jsx";

export async function clientLoader({ params }) {
  return load(`/enquiries/${params.id}`);
}

export async function clientAction({ request, params }) {
  const form = await request.formData();
  return act(() =>
    api(`/enquiries/${params.id}`, {
      method: "PATCH",
      body: { status: form.get("status"), adminNote: form.get("adminNote") ?? "" },
    }),
  );
}

export default function EnquiryDetail() {
  const { enquiry: e } = useLoaderData();
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const current = fetcher.data?.enquiry ?? e;
  const digits = e.phone.replace(/^\+/, "");

  const rows = [
    ["Phone", formatIndianMobile(e.phone)],
    ["Course", e.courseName || "Not sure yet"],
    ["Level", labelFor(ENQUIRY_LEVELS, e.level)],
    ["Prefers", labelFor(CONTACT_METHODS, e.preferredContact)],
    ["Received", formatDate(e.createdAt)],
    ["Sent from", e.source || "—"],
  ];

  return (
    <>
      <Link to="/admin/enquiries" className="inline-flex items-center gap-2 text-small text-muted no-underline hover:text-fg">
        <Icon name="arrowLeft" size={16} />
        All enquiries
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-h2">{e.name}</h1>
          <div className="mt-3">
            <StatusBadge status={current.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`tel:${e.phone}`} className="btn btn-primary">
            <Icon name="phone" size={18} />
            Call {formatIndianMobile(e.phone)}
          </a>
          <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener" className="btn btn-secondary">
            WhatsApp
            <Icon name="external" size={16} />
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="details-title">
          <h2 id="details-title" className="sr-only">
            Details
          </h2>
          <dl className="border-t border-line">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3.5">
                <dt className="text-muted">{k}</dt>
                <dd className={k === "Phone" ? "tabular" : ""}>{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 text-small font-medium text-muted">Message</h3>
          <p className="mt-2 whitespace-pre-line">{e.message || "No message."}</p>
        </section>

        <section aria-labelledby="followup-title" className="border border-line bg-raised p-5">
          <h2 id="followup-title" className="font-sans text-h4 font-semibold">
            Follow-up
          </h2>
          <fetcher.Form method="post" className="mt-5 space-y-5">
            <fieldset>
              <legend className="field-label">Status</legend>
              <div className="space-y-1">
                {ENQUIRY_STATUSES.map((s) => (
                  <label key={s.value} className="choice">
                    <input type="radio" name="status" value={s.value} defaultChecked={current.status === s.value} />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="adminNote" className="field-label">
                Private note
              </label>
              <textarea id="adminNote" name="adminNote" rows={5} maxLength={2000} defaultValue={current.adminNote} className="field" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
              {!busy ? <Notice result={fetcher.data} /> : null}
            </div>
          </fetcher.Form>
        </section>
      </div>
    </>
  );
}
