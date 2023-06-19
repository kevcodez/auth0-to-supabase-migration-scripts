import "dotenv/config";
import { Client } from "pg";
let client: Client | null = null;

export async function dbClient() {
  if (!client) {
    client = new Client({
      user: dbConfig().user,
      host: dbConfig().host,
      database: dbConfig().database,
      password: dbConfig().password,
      port: dbConfig().port,
    });
    await client.connect();
  }

  return client;
}

interface SupabaseDbConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

let config: null | SupabaseDbConfig = null;

export function dbConfig(): SupabaseDbConfig {
  if (!config) {
    config = {
      user: process.env.SUPABASE_DB_USER!,
      host: process.env.SUPABASE_DB_HOST!,
      database: process.env.SUPABASE_DB_DATABASE!,
      password: process.env.SUPABASE_DB_PASSWORD!,
      port: Number(process.env.SUPABASE_DB_PORT),
    };
  }

  return config;
}
