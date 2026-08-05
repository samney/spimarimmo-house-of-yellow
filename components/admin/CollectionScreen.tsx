import Link from "next/link";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./states";
import { PublicationStatus } from "./StatusBadge";
import type { PublishState } from "@/lib/spimar/types";

/* Every CMS collection screen is the same composition: header, editor panel,
   records table. Sharing it keeps table density, empty states and the editor
   position identical across collections — the blueprint's review rule rejects
   an implementation that "treats every panel identically" through accident,
   but consistency here is deliberate and is what makes the console learnable. */

export type CollectionColumn<T> = {
  readonly header: string;
  readonly cell: (row: T) => React.ReactNode;
  readonly numeric?: boolean;
};

export function CollectionScreen<T extends { id: string; state: PublishState }>({
  breadcrumb,
  title,
  lede,
  editorTitle,
  editor,
  rows,
  columns,
  editHref,
  emptyTitle,
  emptyBody,
}: {
  breadcrumb: readonly { label: string; href?: string }[];
  title: string;
  lede: string;
  editorTitle: string;
  editor: React.ReactNode;
  rows: readonly T[];
  columns: readonly CollectionColumn<T>[];
  editHref: (row: T) => string;
  emptyTitle: string;
  emptyBody: string;
}) {
  return (
    <>
      <PageHeader breadcrumb={breadcrumb} title={title} lede={lede} />

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 24rem) minmax(0, 1fr)" }}>
        <section className="card" aria-label={editorTitle}>
          <h2 className="card__label">{editorTitle}</h2>
          <div style={{ marginBlockStart: 16 }}>{editor}</div>
        </section>

        <section aria-label={title}>
          <div className="cluster" style={{ marginBlockEnd: 12 }}>
            <h2>{title}</h2>
            <span className="tertiary">
              {rows.length} enregistrement{rows.length === 1 ? "" : "s"}
            </span>
          </div>

          {rows.length === 0 ? (
            <EmptyState title={emptyTitle} body={emptyBody} />
          ) : (
            <div className="tableWrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.header} className={column.numeric ? "numeric" : undefined}>
                        {column.header}
                      </th>
                    ))}
                    <th>État</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td
                          key={column.header}
                          data-label={column.header}
                          className={column.numeric ? "numeric" : undefined}
                        >
                          {column.cell(row)}
                        </td>
                      ))}
                      <td data-label="État">
                        <PublicationStatus state={row.state} />
                      </td>
                      <td data-label="">
                        <Link href={editHref(row)} className="cell__link">
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
