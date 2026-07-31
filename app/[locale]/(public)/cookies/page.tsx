import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  COOKIES_TITLE,
  COOKIES_POLICY_BEFORE_WIDGET,
  COOKIES_POLICY_AFTER_WIDGET,
} from "@/lib/content/cookies-policy";
import { Inview } from "@/components/public/pages/Inview";
import { ConsentPreferences } from "@/components/public/pages/ConsentPreferences";

export const metadata: Metadata = {
  title: COOKIES_TITLE,
};

/* /cookies/ — dark policy page: h1 + verbatim Complianz document with the
   live consent-preferences widget embedded at section 7.1 (reference DOM in
   qa/cookies-data.json). */
export default async function Cookies({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pageBlocks blocks dark">
      <div className="grainBackground dark" />
      <div className="innerBlocks">
        <Inview className="cookiesBlock">
          <div className="contentWrapper small">
            <h1 className="normalTitle">Cookies</h1>
            <div id="cmplz-document" className="cmplz-document">
              <div dangerouslySetInnerHTML={{ __html: COOKIES_POLICY_BEFORE_WIDGET }} />
              <ConsentPreferences />
              <div dangerouslySetInnerHTML={{ __html: COOKIES_POLICY_AFTER_WIDGET }} />
            </div>
          </div>
        </Inview>
      </div>
    </div>
  );
}
