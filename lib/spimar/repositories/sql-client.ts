/**
 * Minimal SQL execution seam the database adapters depend on.
 *
 * The adapters own their SQL; this interface owns nothing but execution. It
 * exists so the same adapter code runs against node-postgres in production and
 * against PGlite (the real migrations, in WebAssembly) in the contract tests —
 * the adapter cannot tell the difference, which is exactly the point.
 *
 * `transaction` must provide ordinary BEGIN/COMMIT semantics: the callback's
 * queries run on one connection, a thrown error rolls back, and the error is
 * rethrown to the caller.
 */
export interface SqlClient {
  query<T = Record<string, unknown>>(text: string, params?: readonly unknown[]): Promise<T[]>;
  transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T>;
}
