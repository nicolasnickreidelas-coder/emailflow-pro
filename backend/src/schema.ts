import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
})

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  templateId: text('template_id').references(() => templates.id),
  status: text('status', { enum: ['draft', 'scheduled', 'sending', 'sent', 'paused'] }).notNull().default('draft'),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  recipientCount: integer('recipient_count').default(0),
  openCount: integer('open_count').default(0),
  clickCount: integer('click_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
})

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  category: text('category'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
})

export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  email: text('email').notNull(),
  name: text('name'),
  status: text('status', { enum: ['active', 'unsubscribed', 'bounced'] }).notNull().default('active'),
  tags: text('tags'), // JSON array of tags
  customFields: text('custom_fields'), // JSON object
  subscribedAt: integer('subscribed_at', { mode: 'timestamp' }).notNull(),
  unsubscribedAt: integer('unsubscribed_at', { mode: 'timestamp' }),
  lastEmailAt: integer('last_email_at', { mode: 'timestamp' })
})

export const emailEvents = sqliteTable('email_events', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').references(() => campaigns.id).notNull(),
  subscriberId: text('subscriber_id').references(() => subscribers.id).notNull(),
  eventType: text('event_type', { enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'] }).notNull(),
  eventData: text('event_data'), // JSON object for additional data
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})