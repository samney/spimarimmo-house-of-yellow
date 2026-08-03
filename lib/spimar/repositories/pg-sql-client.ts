import "server-only";
import { Pool, type PoolClient } from "pg";
import type { SqlClient } from "./sql-client";

/* node-postgres implementation of the SQL execution seam.

   Used only when `SUPABASE_DATABASE_URL` is configured; the pool is small
   because every caller is a server component or action on one host. Nested
   `transaction` calls join the surrounding transaction rather than opening a
   savepoint — the adapters do not nest, and pretending to support it with
   silent savepoints would hide real design errors. */

class TransactionClient implements SqlClient {
  constructor(private readonly client: PoolClient) {}

  async query<T = Record<string, unknown>>(
    text: string,
    params?: readonly unknown[],
  ): Promise<T[]> {
    const result = await this.client.query(text, params ? [...params] : undefined);
    return result.rows as T[];
  }

  async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
    return fn(this);
  }
}

export class PgSqlClient implements SqlClient {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString, max: 5 });
  }

  async query<T = Record<string, unknown>>(
    text: string,
    params?: readonly unknown[],
  ): Promise<T[]> {
    const result = await this.pool.query(text, params ? [...params] : undefined);
    return result.rows as T[];
  }

  async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const result = await fn(new TransactionClient(client));
      await client.query("commit");
      return result;
    } catch (error) {
      try {
        await client.query("rollback");
      } catch {
        // The original error is the one that matters.
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}
