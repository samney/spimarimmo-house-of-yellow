import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryForm } from "@/components/spimar/EnquiryForm";
import { Inview } from "@/components/primitives/motion/Inview";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import type { Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* `RT-CONTACT` — the conversion surface. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <Inview as="section" className="spimarSection reveal">
      <SplitTitle as="h1" className="spimarHeading" text={t("title")} />
      <p className="spimarLede">{t("lede")}</p>
      <EnquiryForm
        locale={locale as Locale}
        cta="contact-page"
        labels={{
          formLabel: t("formLabel"),
          name: t("name"),
          email: t("email"),
          organisation: t("organisation"),
          message: t("message"),
          consent: t("consent"),
          submit: t("submit"),
          sending: t("sending"),
          successTitle: t("successTitle"),
          successBody: t("successBody"),
          errorTitle: t("errorTitle"),
          errorBody: t("errorBody"),
          duplicateTitle: t("duplicateTitle"),
          duplicateBody: t("duplicateBody"),
          required: t("required"),
          invalidEmail: t("invalidEmail"),
          consentRequired: t("consentRequired"),
          honeypot: t("honeypot"),
        }}
      />
    </Inview>
  );
}
