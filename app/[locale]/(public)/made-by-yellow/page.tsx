import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WorksOverview } from "@/components/public/projects/WorksOverview";
import { SplitTitle } from "@/components/public/home/SplitTitle";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/public/global/Marquee";
import { PlusIcon } from "@/components/public/global/logos";

export const metadata: Metadata = {
  title: "Made by Yellow - HOY | House Of Yellow",
};

export default async function MadeByYellowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <WorksOverview />
      <section className="cultureQuoteAnimationBlock whoWeAre">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">01</span> ]
              </div>
            </div>
            <div className="colMain">
              <div className="label text medium">Who we are</div>
              <SplitTitle
                as="h1"
                className="normalTitle"
                text="A mix of top-of-their-game creators, thinkers and makers. Built on craft, driven by culture, and focused on work that actually lands. This is House of Yellow."
              />
              <span className="buttonsRow">
                <Link className="button light" href="/culture" title="Culture">
                  <span className="label">
                    <span className="fixedLabel">Culture</span>
                    <span className="innerLabel">
                      <Marquee text="Culture" direction="left" speed={90} />
                    </span>
                  </span>
                  <span className="icon">
                    <PlusIcon />
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
