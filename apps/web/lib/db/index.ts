import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// import { env } from '../../env';

// Create the connection
const sql = postgres(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/lionspace');

// Create the database instance
export const db = drizzle(sql);

export type Database = typeof db;