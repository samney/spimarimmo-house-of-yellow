import { CONNECT } from "@/lib/content/pages";
import { PlusIcon, WhatsAppIcon } from "@/components/public/global/logos";
import { Marquee } from "@/components/public/global/Marquee";
import { Inview } from "./Inview";
import { WorksBlock } from "./WorksBlock";
import { Clocks } from "./Clocks";
import { ContactForm } from "./ContactForm";

/* /connect/ — paper page. Structure, classes, and copy replicate the
   reference DOM (qa/connect-main.html): contactBlock (intro, clocks, contact
   details, form, Instagram feed, extra sparkle) + light works block. */
export function ConnectPage() {
  const c = CONNECT;
  return (
    <div className="pageBlocks blocks">
      <div className="grainBackground" />
      <div className="innerBlocks">
        <Inview className="contactBlock">
          <div className="contentWrapper">
            <div className="intro">
              <div className="text smaller medium">{c.intro.label}</div>
              <h1 className="normalTitle">
                {c.intro.titles.map((t) => (
                  <div className="innerTitle" key={t.slice(0, 24)}>
                    {t}
                  </div>
                ))}
              </h1>
            </div>
            <div className="cols">
              <div className="col">
                <div className="text medium number">
                  [ <span className="numIndex">{c.index}</span> ]
                </div>
              </div>
              <div className="col">
                <Clocks zones={c.clocks} />
                <div className="text">
                  <p>
                    <strong>{c.contact.heading}</strong>
                  </p>
                  <p>
                    <a href={`mailto:${c.contact.email}`} target="_blank" rel="noopener">
                      {c.contact.email}
                    </a>
                    <br />
                    <a href={c.contact.phoneHref} target="_blank" rel="noopener">
                      {c.contact.phoneDisplay}
                    </a>
                  </p>
                </div>
                <div className="socials">
                  <a
                    className="socialLink"
                    href={c.contact.linkedin}
                    title="Linkedin"
                    target="_blank"
                    rel="noopener"
                  >
                    <i className="icon-linkedin" aria-hidden="true" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    className="socialLink"
                    href={c.contact.instagram}
                    title="Instagram"
                    target="_blank"
                    rel="noopener"
                  >
                    <i className="icon-instagram" aria-hidden="true" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </div>
                <div className="buttons">
                  <a
                    className="button whatsappButton"
                    href={c.contact.whatsapp}
                    target="_blank"
                    rel="noopener"
                    title={c.contact.whatsappLabel}
                  >
                    <span className="label">
                      <span className="fixedLabel">{c.contact.whatsappLabel}</span>
                      <span className="innerLabel">
                        <Marquee text={c.contact.whatsappLabel} direction="left" speed={90} />
                      </span>
                    </span>
                    <span className="icon">
                      <WhatsAppIcon />
                    </span>
                  </a>
                </div>
              </div>
              <div className="col">
                <ContactForm />
              </div>
            </div>
            <Inview as="div" className="instagramWrapper">
              <div className="sbGrid">
                {c.feed.map((post) => (
                  <a
                    className="sbi_photo"
                    href={post.href}
                    target="_blank"
                    rel="noopener nofollow"
                    key={post.href}
                  >
                    {/* Feed snapshot mirrored locally (reference self-hosts these) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/instagram/${post.image}`} alt={post.alt} loading="lazy" />
                  </a>
                ))}
              </div>
            </Inview>
            <div className="extraIcon">
              <div className="icon">
                <PlusIcon />
              </div>
            </div>
          </div>
        </Inview>

        <WorksBlock index={c.worksIndex} variant="light" showButton />
      </div>
    </div>
  );
}
