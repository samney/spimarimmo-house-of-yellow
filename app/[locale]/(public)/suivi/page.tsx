import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getAcquisitionRepository } from "@/lib/spimar/repositories";

export const dynamic = "force-dynamic";

/* Per-route metadata like every other public page (A-02), with `noindex` kept:
   a status screen is reachable by reference, but it is not content and must not
   appear in search results. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...buildMetadata({
      label: "Suivi de demande",
      description:
        "Consultez l’état de votre demande à partir de sa référence, sans donnée personnelle.",
      path: "/suivi",
      locale,
    }),
    robots: { index: false, follow: false },
  };
}

/* Public reference status (ADM-060).

   Resolves an opaque reference to a coarse status and nothing else. It carries
   no personal data, so the page is safe to reach with only the reference — but
   it is also `noindex`, because a status page is not content.

   An unknown reference and an expired one are answered identically. Telling
   them apart would let someone probe which references exist. */

const STATE_LABEL: Record<string, { title: string; body: string }> = {
  received: {
    title: "Demande reçue",
    body: "Votre demande est enregistrée et attend sa qualification par notre équipe commerciale.",
  },
  rejected: {
    title: "Demande non retenue",
    body: "Cette demande n’a pas pu être traitée. Vous pouvez en déposer une nouvelle.",
  },
  withdrawn: {
    title: "Demande retirée",
    body: "Cette demande a été retirée à votre demande.",
  },
  closed: {
    title: "Demande clôturée",
    body: "Le dossier correspondant est clôturé.",
  },
};

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { ref } = await searchParams;
  const reference = ref?.trim() ?? "";
  const status = reference ? await getAcquisitionRepository().getStatus(reference) : null;
  const label = status ? (STATE_LABEL[status.status] ?? STATE_LABEL.received) : null;

  return (
    <main className="statusPage">
      <h1>Suivi de demande</h1>
      <p className="statusPage__lede">
        Saisissez la référence qui vous a été communiquée après l’envoi de votre demande.
      </p>

      <form className="statusPage__form" method="get">
        <label htmlFor="ref" className="sr-only">
          Référence de la demande
        </label>
        <input
          id="ref"
          name="ref"
          defaultValue={reference}
          placeholder="référence à 32 caractères"
          autoComplete="off"
        />
        <button className="statusPage__submit" type="submit">
          Vérifier
        </button>
      </form>

      {reference ? (
        <div className="statusPage__panel">
          {label && status ? (
            <>
              <p className="statusPage__state">{label.title}</p>
              <p>{label.body}</p>
              <p className="statusPage__meta">
                Déposée le{" "}
                <time dateTime={status.submittedAt}>{status.submittedAt.slice(0, 10)}</time>. Cette
                page n’affiche aucune donnée personnelle.
              </p>
            </>
          ) : (
            <>
              <p className="statusPage__state">Référence inconnue</p>
              <p>
                Aucune demande ne correspond à cette référence. Vérifiez la saisie — elle comporte
                32 caractères.
              </p>
            </>
          )}
        </div>
      ) : null}
    </main>
  );
}
