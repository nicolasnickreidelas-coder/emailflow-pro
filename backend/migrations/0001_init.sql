CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
);

CREATE TABLE templates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    is_public INTEGER DEFAULT 0,
    category TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
);

CREATE TABLE campaigns (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_id TEXT REFERENCES templates(id),
    status TEXT NOT NULL DEFAULT 'draft',
    scheduled_at INTEGER,
    sent_at INTEGER,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
);

CREATE TABLE subscribers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    email TEXT NOT NULL,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    tags TEXT,
    custom_fields TEXT,
    subscribed_at INTEGER NOT NULL,
    unsubscribed_at INTEGER,
    last_email_at INTEGER
);

CREATE TABLE email_events (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    subscriber_id TEXT NOT NULL REFERENCES subscribers(id),
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_subscribers_user_id ON subscribers(user_id);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_email_events_campaign_id ON email_events(campaign_id);