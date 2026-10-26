import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

import { formatIndianMobile } from "@moh/shared/phone";

import { act, api, load } from "../api.js";
import { AdminPageHeader, Field, Notice } from "../components/ui.jsx";

export async function clientLoader() {
  return load("/site-settings");
}

export async function clientAction({ request }) {
  const f = await request.formData();
  const get = (k) => String(f.get(k) ?? "");
  const result = await act(() =>
    api("/site-settings", {
      method: "PATCH",
      body: {
        academyName: get("academyName"),
        founderName: get("founderName"),
        founderBio: get("founderBio"),
        phone: get("phone"),
        email: get("email"),
        address: {
          line1: get("address.line1"),
          line2: get("address.line2"),
          locality: get("address.locality"),
          city: get("address.city"),
          region: get("address.region"),
          postalCode: get("address.postalCode"),
        },
        instagramUrl: get("instagramUrl"),
        youtubeUrl: get("youtubeUrl"),
        mapsUrl: get("mapsUrl"),
        hours: get("hours"),
        seo: { title: get("seo.title"), description: get("seo.description") },
      },
    }),
  );
  return { ...result, message: result.ok ? "Settings saved. The website shows the new details now." : undefined };
}

function Section({ title, description, children }) {
  return (
    <fieldset className="grid gap-x-10 gap-y-6 border-t border-line py-8 lg:grid-cols-[16rem_1fr]">
      <div>
        <legend className="font-sans text-h4 font-semibold">{title}</legend>
        {description ? <p className="mt-2 text-small text-muted">{description}</p> : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function Settings() {
  const { settings: loaded } = useLoaderData();
  const result = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  const s = result?.settings ?? loaded;
  const a = s.address ?? {};

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Public details shown across the website. Leave anything you have not confirmed empty — empty fields are simply not shown."
      />
      <Form method="post" className="mt-2" noValidate>
        <Section title="Academy">
          <Field label="Academy name" name="academyName" result={result}>
            {(p) => <input {...p} defaultValue={s.academyName} required className="field" />}
          </Field>
          <Field label="Founder / owner" name="founderName" result={result}>
            {(p) => <input {...p} defaultValue={s.founderName} className="field" />}
          </Field>
          <Field label="Founder bio" name="founderBio" hint="Shown with the founder on the homepage and About page." result={result} className="sm:col-span-2">
            {(p) => <textarea {...p} defaultValue={s.founderBio} maxLength={600} rows={3} className="field min-h-0" />}
          </Field>
        </Section>

        <Section title="Contact" description="The phone number powers every Call button on the website.">
          <Field label="Phone" name="phone" result={result}>
            {(p) => <input {...p} type="tel" defaultValue={s.phone ? formatIndianMobile(s.phone) : ""} className="field tabular" />}
          </Field>
          <Field label="Email" name="email" hint="Not shown until you add one." result={result}>
            {(p) => <input {...p} type="email" defaultValue={s.email} className="field" />}
          </Field>
          <Field label="Opening hours / timings" name="hours" hint="Shown on Contact and the homepage. Leave empty until confirmed." result={result} className="sm:col-span-2">
            {(p) => <input {...p} defaultValue={s.hours} maxLength={200} className="field" />}
          </Field>
        </Section>

        <Section title="Address">
          <Field label="Address line 1" name="address.line1" result={result} className="sm:col-span-2">
            {(p) => <input {...p} defaultValue={a.line1} className="field" />}
          </Field>
          <Field label="Address line 2" name="address.line2" result={result} className="sm:col-span-2">
            {(p) => <input {...p} defaultValue={a.line2} className="field" />}
          </Field>
          <Field label="Area" name="address.locality" result={result}>
            {(p) => <input {...p} defaultValue={a.locality} className="field" />}
          </Field>
          <Field label="City" name="address.city" result={result}>
            {(p) => <input {...p} defaultValue={a.city} className="field" />}
          </Field>
          <Field label="State" name="address.region" result={result}>
            {(p) => <input {...p} defaultValue={a.region} className="field" />}
          </Field>
          <Field label="PIN code" name="address.postalCode" result={result}>
            {(p) => <input {...p} inputMode="numeric" defaultValue={a.postalCode} className="field tabular" />}
          </Field>
          <Field label="Google Maps link" name="mapsUrl" hint="Paste the academy’s share link from Google Maps. Without it, Directions searches for the address." result={result} className="sm:col-span-2">
            {(p) => <input {...p} type="url" defaultValue={s.mapsUrl} className="field" />}
          </Field>
        </Section>

        <Section title="Social">
          <Field label="Instagram" name="instagramUrl" result={result}>
            {(p) => <input {...p} type="url" defaultValue={s.instagramUrl} placeholder="https://www.instagram.com/…" className="field" />}
          </Field>
          <Field label="YouTube" name="youtubeUrl" result={result}>
            {(p) => <input {...p} type="url" defaultValue={s.youtubeUrl} placeholder="https://www.youtube.com/@…" className="field" />}
          </Field>
        </Section>

        <Section title="Search engines" description="Optional overrides for the homepage title and description in Google.">
          <Field label="Homepage title" name="seo.title" hint="Up to 70 characters." result={result} className="sm:col-span-2">
            {(p) => <input {...p} defaultValue={s.seo?.title} maxLength={70} className="field" />}
          </Field>
          <Field label="Homepage description" name="seo.description" hint="Up to 170 characters." result={result} className="sm:col-span-2">
            {(p) => <textarea {...p} defaultValue={s.seo?.description} maxLength={170} rows={3} className="field min-h-0" />}
          </Field>
        </Section>

        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-4 border-t border-line bg-bg px-5 py-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save settings"}
          </button>
          {!busy ? <Notice result={result} /> : null}
        </div>
      </Form>
    </>
  );
}
