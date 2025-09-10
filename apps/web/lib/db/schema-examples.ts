import { 
  boolean, 
  integer, 
  jsonb, 
  pgTable, 
  text,
  timestamp,
  uuid,
  varchar,
  decimal,
  date,
  time,
  serial,
  bigint,
  doublePrecision,
  real,
  pgEnum,
  index,
  uniqueIndex,
  primaryKey,
  foreignKey,
  check
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// =====================================================
// ENUMS - Define type-safe enums
// =====================================================

export const userRoleEnum = pgEnum('user_role', ['admin', 'moderator', 'user', 'guest']);
export const threatLevelEnum = pgEnum('threat_level', ['critical', 'high', 'medium', 'low', 'info']);
export const operationStatusEnum = pgEnum('operation_status', ['pending', 'active', 'completed', 'failed', 'cancelled']);
export const priorityEnum = pgEnum('priority', ['urgent', 'high', 'medium', 'low']);

// =====================================================
// CORE USER MANAGEMENT
// =====================================================

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo'),
  website: text('website'),
  settings: jsonb('settings').default({}).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('org_slug_idx').on(table.slug),
  activeIdx: index('org_active_idx').on(table.isActive),
  createdAtIdx: index('org_created_at_idx').on(table.createdAt),
}));

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').unique().notNull(),
  username: varchar('username', { length: 50 }).unique(),
  passwordHash: text('password_hash'),
  name: text('name'),
  avatar: text('avatar'),
  bio: text('bio'),
  role: userRoleEnum('role').default('user').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  settings: jsonb('settings').default({}).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  usernameIdx: uniqueIndex('users_username_idx').on(table.username),
  orgIdx: index('users_org_idx').on(table.organizationId),
  roleIdx: index('users_role_idx').on(table.role),
  activeIdx: index('users_active_idx').on(table.isActive),
  emailCheck: check('email_check', sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`),
}));

// =====================================================
// AUTHENTICATION & SESSIONS
// =====================================================

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  deviceInfo: jsonb('device_info'),
  expiresAt: timestamp('expires_at').notNull(),
  lastActivityAt: timestamp('last_activity_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex('sessions_token_idx').on(table.token),
  userIdx: index('sessions_user_idx').on(table.userId),
  expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
}));

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  key: text('key').unique().notNull(),
  permissions: jsonb('permissions').default([]).notNull(),
  rateLimit: integer('rate_limit').default(1000),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  keyIdx: uniqueIndex('api_keys_key_idx').on(table.key),
  userIdx: index('api_keys_user_idx').on(table.userId),
  activeIdx: index('api_keys_active_idx').on(table.isActive),
}));

// =====================================================
// THREAT INTELLIGENCE
// =====================================================

export const threats = pgTable('threats', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  reportedBy: uuid('reported_by').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  threatType: text('threat_type').notNull(),
  level: threatLevelEnum('level').notNull(),
  source: text('source'),
  indicators: jsonb('indicators').default([]).notNull(),
  affectedAssets: jsonb('affected_assets').default([]).notNull(),
  mitigationSteps: jsonb('mitigation_steps').default([]).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  isVerified: boolean('is_verified').default(false).notNull(),
  verifiedBy: uuid('verified_by').references(() => users.id, { onDelete: 'set null' }),
  verifiedAt: timestamp('verified_at'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('threats_org_idx').on(table.organizationId),
  levelIdx: index('threats_level_idx').on(table.level),
  typeIdx: index('threats_type_idx').on(table.threatType),
  verifiedIdx: index('threats_verified_idx').on(table.isVerified),
  createdIdx: index('threats_created_idx').on(table.createdAt),
  confidenceCheck: check('confidence_check', sql`${table.confidence} >= 0 AND ${table.confidence} <= 100`),
}));

// =====================================================
// OPERATIONS & CAMPAIGNS
// =====================================================

export const operations = pgTable('operations', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  codename: varchar('codename', { length: 50 }),
  description: text('description'),
  objectives: jsonb('objectives').default([]).notNull(),
  status: operationStatusEnum('status').default('pending').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  resources: jsonb('resources').default({}).notNull(),
  participants: jsonb('participants').default([]).notNull(),
  results: jsonb('results'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('operations_org_idx').on(table.organizationId),
  statusIdx: index('operations_status_idx').on(table.status),
  priorityIdx: index('operations_priority_idx').on(table.priority),
  dateRangeIdx: index('operations_date_range_idx').on(table.startDate, table.endDate),
  dateCheck: check('date_check', sql`${table.endDate} >= ${table.startDate}`),
}));

// =====================================================
// MESSAGING & COMMUNICATIONS
// =====================================================

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'set null' }),
  parentId: uuid('parent_id'),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }).default('text').notNull(),
  attachments: jsonb('attachments').default([]).notNull(),
  reactions: jsonb('reactions').default({}).notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
  editedAt: timestamp('edited_at'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('messages_conversation_idx').on(table.conversationId),
  senderIdx: index('messages_sender_idx').on(table.senderId),
  parentIdx: index('messages_parent_idx').on(table.parentId),
  createdIdx: index('messages_created_idx').on(table.createdAt),
  contentSearchIdx: index('messages_content_search_idx').using('gin', sql`to_tsvector('english', ${table.content})`),
}));

// =====================================================
// AUDIT & ACTIVITY LOGS
// =====================================================

export const auditLogs = pgTable('audit_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  changes: jsonb('changes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_user_idx').on(table.userId),
  orgIdx: index('audit_org_idx').on(table.organizationId),
  actionIdx: index('audit_action_idx').on(table.action),
  resourceIdx: index('audit_resource_idx').on(table.resource, table.resourceId),
  createdIdx: index('audit_created_idx').on(table.createdAt),
}));

// =====================================================
// ANALYTICS & METRICS
// =====================================================

export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  metricType: varchar('metric_type', { length: 100 }).notNull(),
  value: doublePrecision('value').notNull(),
  unit: varchar('unit', { length: 50 }),
  dimensions: jsonb('dimensions').default({}).notNull(),
  tags: text('tags').array(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  orgTypeIdx: index('metrics_org_type_idx').on(table.organizationId, table.metricType),
  timestampIdx: index('metrics_timestamp_idx').on(table.timestamp),
  tagsIdx: index('metrics_tags_idx').using('gin', table.tags),
}));

// =====================================================
// NOTIFICATIONS & ALERTS
// =====================================================

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data').default({}).notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  priority: priorityEnum('priority').default('medium').notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  unreadIdx: index('notifications_unread_idx').on(table.userId, table.isRead),
  priorityIdx: index('notifications_priority_idx').on(table.priority),
  expiresIdx: index('notifications_expires_idx').on(table.expiresAt),
}));

// =====================================================
// FILES & MEDIA
// =====================================================

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  path: text('path').notNull(),
  url: text('url'),
  thumbnailUrl: text('thumbnail_url'),
  metadata: jsonb('metadata').default({}).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('files_user_idx').on(table.userId),
  orgIdx: index('files_org_idx').on(table.organizationId),
  mimeIdx: index('files_mime_idx').on(table.mimeType),
  uploadedIdx: index('files_uploaded_idx').on(table.uploadedAt),
}));

// =====================================================
// RELATIONS - Define table relationships
// =====================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  sessions: many(sessions),
  apiKeys: many(apiKeys),
  threats: many(threats),
  operations: many(operations),
  messages: many(messages),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
  files: many(files),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  threats: many(threats),
  operations: many(operations),
  metrics: many(metrics),
  auditLogs: many(auditLogs),
  files: many(files),
}));

export const threatsRelations = relations(threats, ({ one }) => ({
  organization: one(organizations, {
    fields: [threats.organizationId],
    references: [organizations.id],
  }),
  reporter: one(users, {
    fields: [threats.reportedBy],
    references: [users.id],
    relationName: 'threatReporter',
  }),
  verifier: one(users, {
    fields: [threats.verifiedBy],
    references: [users.id],
    relationName: 'threatVerifier',
  }),
}));

export const operationsRelations = relations(operations, ({ one }) => ({
  organization: one(organizations, {
    fields: [operations.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [operations.createdBy],
    references: [users.id],
  }),
}));

// =====================================================
// TYPE EXPORTS - TypeScript type inference
// =====================================================

// Organizations
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

// Users
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Sessions
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

// API Keys
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

// Threats
export type Threat = typeof threats.$inferSelect;
export type NewThreat = typeof threats.$inferInsert;

// Operations
export type Operation = typeof operations.$inferSelect;
export type NewOperation = typeof operations.$inferInsert;

// Messages
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Audit Logs
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// Metrics
export type Metric = typeof metrics.$inferSelect;
export type NewMetric = typeof metrics.$inferInsert;

// Notifications
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// Files
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;

// =====================================================
// COMPOSITE TABLES - Many-to-many relationships
// =====================================================

export const userTeams = pgTable('user_teams', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  teamId: uuid('team_id').notNull(),
  role: varchar('role', { length: 50 }).default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.teamId] }),
  userIdx: index('user_teams_user_idx').on(table.userId),
  teamIdx: index('user_teams_team_idx').on(table.teamId),
}));

export const threatTags = pgTable('threat_tags', {
  threatId: uuid('threat_id').references(() => threats.id, { onDelete: 'cascade' }).notNull(),
  tag: varchar('tag', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.threatId, table.tag] }),
  threatIdx: index('threat_tags_threat_idx').on(table.threatId),
  tagIdx: index('threat_tags_tag_idx').on(table.tag),
}));

// =====================================================
// ADVANCED PATTERNS
// =====================================================

// Soft delete pattern with archived timestamp
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  isArchived: boolean('is_archived').default(false).notNull(),
  archivedAt: timestamp('archived_at'),
  archivedBy: uuid('archived_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  archivedIdx: index('documents_archived_idx').on(table.isArchived),
  activeDocumentsIdx: index('documents_active_idx').on(table.isArchived).where(sql`${table.isArchived} = false`),
}));

// Versioning pattern
export const configVersions = pgTable('config_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  configId: uuid('config_id').notNull(),
  version: integer('version').notNull(),
  data: jsonb('data').notNull(),
  changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
  changeLog: text('change_log'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  configVersionIdx: uniqueIndex('config_version_idx').on(table.configId, table.version),
  configIdx: index('config_versions_config_idx').on(table.configId),
  versionCheck: check('version_positive', sql`${table.version} > 0`),
}));

// Hierarchical data pattern
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentId: uuid('parent_id'),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  path: text('path').notNull(), // Materialized path for efficient queries
  depth: integer('depth').default(0).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  parentIdx: index('categories_parent_idx').on(table.parentId),
  pathIdx: index('categories_path_idx').on(table.path),
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
  parentFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: 'categories_parent_fk',
  }),
}));

// Time series data pattern
export const events = pgTable('events', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  data: jsonb('data').notNull(),
  source: text('source'),
  processed: boolean('processed').default(false).notNull(),
}, (table) => ({
  timestampTypeIdx: index('events_timestamp_type_idx').on(table.timestamp, table.eventType),
  processedIdx: index('events_processed_idx').on(table.processed).where(sql`${table.processed} = false`),
}));

// Full-text search pattern
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  searchVector: sql`tsvector`.generatedAlwaysAs(
    sql`to_tsvector('english', ${sql.raw('title')} || ' ' || ${sql.raw('content')})`
  ),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  searchIdx: index('articles_search_idx').using('gin', table.searchVector),
  publishedIdx: index('articles_published_idx').on(table.publishedAt),
}));

// JSON aggregation pattern for analytics
export const analyticsEvents = pgTable('analytics_events', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  sessionId: uuid('session_id').notNull(),
  eventName: varchar('event_name', { length: 100 }).notNull(),
  properties: jsonb('properties').default({}).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index('analytics_session_idx').on(table.sessionId),
  eventNameIdx: index('analytics_event_name_idx').on(table.eventName),
  timestampIdx: index('analytics_timestamp_idx').on(table.timestamp),
  propertiesIdx: index('analytics_properties_idx').using('gin', table.properties),
}));