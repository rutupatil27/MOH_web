import { Link, useLoaderData } from "react-router";

import { CONTACT_METHODS, ENQUIRY_LEVELS, labelFor } from "@moh/shared/constants";

import { Icon } from "../../components/ui/Icon.jsx";
import { formatDate, load } from "../api.js";
import { AdminPageHeader, EmptyState } from "../components/ui.jsx";

export async function clientLoader() {
  return load("/dashboard");
}

export default function Dashboard() {
  const { enquiries, courseCount, galleryCount, latestNew } = useLoaderData();

  const counts = [
    { label: "New enquiries", value: enquiries.new, to: "/admin/enquiries?status=new", emphasis: enquiries.new > 0 },
    { label: "All enquiries", value: enquiries.total, to: "/admin/enquiries" },
    { label: "Courses", value: courseCount, to: "/admin/courses" },
    { label: "Gallery photos", value: galleryCount, to: "/admin/gallery" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Enquiries waiting for a call, and what is on the website." />

      <dl className="mt-8 grid grid-cols-2 border border-line bg-raised lg:grid-cols-4">
        {counts.map((c, i) => (
          <div key={c.label} className={`${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""} border-line`}>
            <Link to={c.to} className="block px-5 py-5 no-underline hover:bg-bg">
              <dt className="text-small text-muted">{c.label}</dt>
              <dd className={`mt-1 font-display text-h2 tabular ${c.emphasis ? "text-accent" : ""}`}>{c.value}</dd>
            </Link>
          </div>
        ))}
      </dl>

      <section className="mt-12" aria-labelledby="new-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="new-title" className="font-sans text-h4 font-semibold">
            Newest enquiries to call back
          </h2>
          <Link to="/admin/enquiries?status=new" className="link-accent text-small">
            See all new
          </Link>
        </div>
        {latestNew.length ? (
          <ul className="mt-4 border-t border-line">
            {latestNew.map((e) => (
              <li key={e.id} className="border-b border-line">
                <Link
                  to={`/admin/enquiries/${e.id}`}
                  className="grid gap-x-6 gap-y-1 px-1 py-4 no-underline hover:bg-raised sm:grid-cols-[1fr_auto_auto]"
                >
                  <span>
                    <span className="font-medium">{e.name}</span>
                    <span className="ml-3 text-muted tabular">{e.phone}</span>
                  </span>
                  <span className="text-small text-muted">
                    {e.courseName || "Course not decided"} · {labelFor(ENQUIRY_LEVELS, e.level)} · {labelFor(CONTACT_METHODS, e.preferredContact)}
                  </span>
                  <span className="text-small text-muted">{formatDate(e.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <EmptyState title="No new enquiries">Every enquiry has been followed up. New ones from the website appear here.</EmptyState>
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="Quick actions">
        <Link to="/admin/gallery" className="btn btn-secondary justify-between">
          Add gallery photos
          <Icon name="arrowRight" size={18} />
        </Link>
        <Link to="/admin/courses" className="btn btn-secondary justify-between">
          Edit course text
          <Icon name="arrowRight" size={18} />
        </Link>
        <Link to="/admin/settings" className="btn btn-secondary justify-between">
          Update contact details
          <Icon name="arrowRight" size={18} />
        </Link>
      </section>
    </>
  );
}
