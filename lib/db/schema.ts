import { 
  boolean, 
  integer, 
  jsonb, 
  pgTable, 
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const intelligenceReports = pgTable('intelligence_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  content: jsonb('content').notNull(),
  category: text('category').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const matrixAnalysis = pgTable('matrix_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  analysisType: text('analysis_type').notNull(),
  inputData: jsonb('input_data').notNull(),
  results: jsonb('results').notNull(),
  confidence: integer('confidence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type IntelligenceReport = typeof intelligenceReports.$inferSelect;
export type NewIntelligenceReport = typeof intelligenceReports.$inferInsert;

export type MatrixAnalysis = typeof matrixAnalysis.$inferSelect;
export type NewMatrixAnalysis = typeof matrixAnalysis.$inferInsert;