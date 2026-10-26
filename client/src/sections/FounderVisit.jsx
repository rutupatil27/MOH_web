import { SiteImage, hasSiteImage } from "../components/media/SiteImage.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { addressLines, directionsUrl, phoneOf } from "../lib/site.js";

/** Founder: name and approved bio. A photo appears only once a real one (founder-photo) is supplied. */
export function FounderSection({ settings, showLink = true }) {
  if (!settings?.founderName) return null;
  const withPhoto = hasSiteImage("founder-photo");
  return (
    <section data-surface="light" className="section overflow-hidden" aria-labelledby="founder-title">
      <div className="container-site grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="kicker">Our founder</span>
          <h2 id="founder-title" className="mt-3 font-display text-h2">
            Meet Our Founder
            <br />
            {settings.founderName}
          </h2>
          {settings.founderBio ? (
            <p className="mt-6 max-w-[46ch] text-muted">
              The Music of Heart Music Academy is founded by {settings.founderName}, {lowerFirst(settings.founderBio)}
            </p>
          ) : null}
          {showLink ? (
            <Button to="/about" arrow className="mt-8">
              Read More
            </Button>
          ) : null}
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7">
          {withPhoto ? (
            <div className="print-frame">
              <SiteImage
                name="founder-photo"
                alt={`${settings.founderName}, founder of The Music of Heart, smiling by a lake at sunset`}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="w-full"
                aspectRatio="4 / 3"
              />
            </div>
          ) : null}
          <p
            aria-hidden="true"
            // With the photo, the note sits bottom-left over the lake, clear of the founder on the right.
            className={`paper-note script w-fit leading-[0.95] ${withPhoto ? "absolute -bottom-6 left-0 -rotate-3 px-5 py-4 max-sm:text-[1.7rem] sm:px-8 sm:py-6" : "mx-auto rotate-[3deg] px-8 py-6 text-[clamp(2.6rem,2rem+2vw,4rem)]"}`}
          >
            Music People
            <br />
            Better Humans
          </p>
        </div>
      </div>
    </section>
  );
}

function lowerFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/**
 * Credentials with their badges. A badge shows only when its real artwork is in
 * assets/source (suro-bharati-logo, iso-certified); otherwise a gold icon stands in.
 */
export function AffiliatedBand() {
  const cards = [
    { image: "suro-bharati-logo", kicker: "Affiliated with", title: "Suro Bharati Sangeet Kala Kendra" },
    { image: "iso-certified", kicker: "Certification", title: "ISO Certified" },
  ];
  return (
    <section data-surface="dark" className="py-(--space-block)" aria-labelledby="affiliated-title">
      <div className="container-site">
        <h2 id="affiliated-title" className="font-display text-h2">
          Proudly Affiliated &amp; Certified
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <li key={c.title} className="flex items-center gap-6 rounded-card border border-line-strong p-6">
              {hasSiteImage(c.image) ? (
                <SiteImage name={c.image} alt={`${c.title} badge`} sizes="6rem" fit="contain" placeholder={false} aspectRatio="1 / 1" className="w-24 shrink-0" />
              ) : (
                <span className="icon-ring h-16! w-16! shrink-0">
                  <Icon name="award" size={28} />
                </span>
              )}
              <span>
                <span className="block text-small text-muted">{c.kicker}</span>
                <span className="mt-1 block font-display text-h4">{c.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function VisitDetails({ settings, title = "Visit Us", headingLevel = 2, id = "visit-title" }) {
  const Heading = `h${headingLevel}`;
  const phone = phoneOf(settings);
  const directions = directionsUrl(settings);
  return (
    <div>
      <Heading id={id} className="font-display text-h2">
        {title}
      </Heading>
      <ul className="mt-6 space-y-4">
        <li className="flex gap-4">
          <Icon name="pin" size={22} className="mt-0.5 shrink-0" />
          <address className="not-italic">
            {addressLines(settings).map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </li>
        {phone ? (
          <li className="flex items-center gap-4">
            <Icon name="phone" size={22} />
            <a href={phone.href} className="no-underline hover:text-accent tabular">
              {phone.display}
            </a>
          </li>
        ) : null}
        {settings?.hours ? (
          <li className="flex items-center gap-4">
            <Icon name="clock" size={22} />
            <span>{settings.hours}</span>
          </li>
        ) : null}
        {settings?.email ? (
          <li className="flex items-center gap-4">
            <Icon name="mail" size={22} />
            <a href={`mailto:${settings.email}`} className="link-accent">
              {settings.email}
            </a>
          </li>
        ) : null}
      </ul>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        {settings?.instagramUrl ? (
          <a href={settings.instagramUrl} target="_blank" rel="noopener me" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-accent hover:border-accent">
            <Icon name="instagram" size={20} />
          </a>
        ) : null}
        {settings?.youtubeUrl ? (
          <a href={settings.youtubeUrl} target="_blank" rel="noopener me" aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-accent hover:border-accent">
            <Icon name="youtube" size={20} />
          </a>
        ) : null}
        {directions ? (
          <a href={directions} target="_blank" rel="noopener" aria-label="Open in Google Maps" className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-accent hover:border-accent">
            <Icon name="pin" size={20} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function VisitSection({ settings }) {
  const withSketch = hasSiteImage("visit-sketch");
  return (
    <section data-surface="light" className="section overflow-hidden" aria-labelledby="visit-title">
      <div className="container-site grid items-center gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <VisitDetails settings={settings} />
        </div>
        {withSketch ? (
          <div className="lg:col-span-8">
            <SiteImage
              name="visit-sketch"
              alt=""
              sizes="(min-width: 1024px) 60vw, 100vw"
              fit="contain"
              placeholder={false}
              className="paper-blend w-full"
            />
          </div>
        ) : (
          <p aria-hidden="true" className="script text-[clamp(2.8rem,2rem+3vw,5rem)] leading-[0.95] lg:col-span-5 lg:col-start-8 lg:text-right">
            Let’s Make
            <br />
            Music Together
          </p>
        )}
      </div>
    </section>
  );
}
