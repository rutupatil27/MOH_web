import { Form, Link, useLoaderData, useSearchParams } from "react-router";

import { ENQUIRY_LEVELS, ENQUIRY_STATUSES, labelFor } from "@moh/shared/constants";
import { formatIndianMobile } from "@moh/shared/phone";

import { Icon } from "../../components/ui/Icon.jsx";
import { formatDate, load } from "../api.js";
import { AdminPageHeader, EmptyState, StatusBadge } from "../components/ui.jsx";

export async function clientLoader({ request }) {
  const params = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const key of ["status", "q", "page"]) if (params.get(key)) query.set(key, params.get(key));
  const [list, dashboard] = await Promise.all([load(`/enquiries?${query}`), load("/dashboard")]);
  return { ...list, counts: dashboard.enquiries };
}

export default function Enquiries() {
  const { items, total, page, pages, counts } = useLoaderData();
  const [params] = useSearchParams();
  const status = params.get("status") ?? "";
  const q = params.get("q") ?? "";

  const tabs = [{ value: "", label: "All", count: counts.total }, ...ENQUIRY_STATUSES.map((s) => ({ ...s, count: counts[s.value] }))];
  const withParams = (changes) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) (v ? next.set(k, v) : next.delete(k));
    return `?${next}`;
  };

  return (
    <>
      <AdminPageHeader title="Enquiries" description="Everyone who asked about classes through the website. Private to the admin." />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Filter by status">
          <ul className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <li key={t.value || "all"}>
                <Link
                  to={withParams({ status: t.value, page: "" })}
                  aria-current={status === t.value ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-xs border px-3 py-2 text-small no-underline ${
                    status === t.value ? "border-fg bg-fg text-bg" : "border-line hover:border-line-strong"
                  }`}
                >
                  {t.label}
                  <span className="tabular opacity-70">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Form role="search" className="flex w-full gap-2 sm:w-auto">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label htmlFor="q" className="sr-only">
            Search enquiries
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Name, phone or course" className="field min-h-11 sm:w-64" />
          <button type="submit" className="btn btn-secondary min-h-11 px-4">
            Search
          </button>
        </Form>
      </div>

      {items.length ? (
        <>
          <div className="mt-6 overflow-x-auto border border-line bg-raised">
            <table className="w-full min-w-[46rem] text-left text-small">
              <caption className="sr-only">Enquiries, newest first</caption>
              <thead className="border-b border-line text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Received</th>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium">Course · level</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-b-0 hover:bg-bg">
                    <td className="px-4 py-3 whitespace-nowrap text-muted tabular">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3 font-medium">{e.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap tabular">
                      <a href={`tel:${e.phone}`} className="no-underline hover:text-accent">
                        {formatIndianMobile(e.phone)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {e.courseName || "Not sure yet"} · {labelFor(ENQUIRY_LEVELS, e.level)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/enquiries/${e.id}`} className="inline-flex items-center gap-1 link-accent whitespace-nowrap">
                        Open
                        <Icon name="arrowRight" size={16} />
                        <span className="sr-only"> enquiry from {e.name}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-small text-muted">
            <p className="tabular">
              {total} {total === 1 ? "enquiry" : "enquiries"}
              {pages > 1 ? ` · page ${page} of ${pages}` : ""}
            </p>
            {pages > 1 ? (
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link to={withParams({ page: String(page - 1) })} className="btn btn-secondary min-h-10 px-4">
                    Previous
                  </Link>
                ) : null}
                {page < pages ? (
                  <Link to={withParams({ page: String(page + 1) })} className="btn btn-secondary min-h-10 px-4">
                    Next
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState title={q || status ? "No enquiries match" : "No enquiries yet"}>
            {q || status ? (
              <Link to="/admin/enquiries" className="link-accent">
                Clear the filters
              </Link>
            ) : (
              "Enquiries sent from the website’s forms will appear here."
            )}
          </EmptyState>
        </div>
      )}
    </>
  );
}
