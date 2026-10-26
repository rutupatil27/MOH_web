import { Link } from "react-router";

import { CREDENTIALS, NAV, addressLines, directionsUrl, instagramHandle, phoneOf } from "../../lib/site.js";
import { Icon } from "../ui/Icon.jsx";
import { Logo } from "../ui/Logo.jsx";

export function SiteFooter({ settings, courses = [] }) {
  const phone = phoneOf(settings);
  const lines = addressLines(settings);
  const directions = directionsUrl(settings);

  return (
    <footer data-surface="dark" className="border-t border-line pb-(--mobile-bar-h) md:pb-0">
      <div className="container-site grid gap-x-10 gap-y-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" aria-label="The Music of Heart — home" className="inline-block">
            <Logo className="h-20 w-auto" />
          </Link>
          <p className="mt-6 max-w-[34ch] text-muted">
            Offline guitar, keyboard, vocals and drums classes in Nashik Road, for ages 4 and up.
          </p>
          <p className="mt-6 text-small text-muted">
            {CREDENTIALS.affiliation}
            <br />
            {CREDENTIALS.iso}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-4">
          <div>
            <h2 className="label text-muted">Academy</h2>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="no-underline hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/enquire" className="no-underline hover:text-accent">
                  Enquire
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="label text-muted">Courses</h2>
            <ul className="mt-5 space-y-3">
              {courses.map((course) => (
                <li key={course.slug}>
                  <Link to={`/courses/${course.slug}`} className="no-underline hover:text-accent">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="md:col-span-3">
          <h2 className="label text-muted">Visit</h2>
          <address className="mt-5 not-italic text-small leading-relaxed">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-6 space-y-3 text-small">
            {phone ? (
              <li>
                <a href={phone.href} className="inline-flex items-center gap-2.5 no-underline hover:text-accent tabular">
                  <Icon name="phone" size={17} />
                  {phone.display}
                </a>
              </li>
            ) : null}
            {directions ? (
              <li>
                <a href={directions} className="inline-flex items-center gap-2.5 no-underline hover:text-accent" rel="noopener" target="_blank">
                  <Icon name="route" size={17} />
                  Get directions
                </a>
              </li>
            ) : null}
            {settings?.instagramUrl ? (
              <li>
                <a href={settings.instagramUrl} className="inline-flex items-center gap-2.5 no-underline hover:text-accent" rel="noopener me" target="_blank">
                  <Icon name="instagram" size={17} />
                  {instagramHandle(settings.instagramUrl) ?? "Instagram"}
                </a>
              </li>
            ) : null}
            {settings?.youtubeUrl ? (
              <li>
                <a href={settings.youtubeUrl} className="inline-flex items-center gap-2.5 no-underline hover:text-accent" rel="noopener me" target="_blank">
                  <Icon name="youtube" size={17} />
                  YouTube
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-micro text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {settings?.academyName ?? "The Music of Heart Music Academy"}
        </p>
        <p>Nashik Road, Nashik, Maharashtra</p>
      </div>
    </footer>
  );
}
