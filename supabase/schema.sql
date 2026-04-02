-- Notions11 PostgreSQL schema for Supabase
-- Run this in the Supabase SQL editor

-- Users
CREATE TABLE IF NOT EXISTS users (
  id               BIGSERIAL PRIMARY KEY,
  user_name        VARCHAR       NOT NULL,
  user_email       VARCHAR       UNIQUE NOT NULL,
  password_hash    VARCHAR       NOT NULL,
  is_pro           INT           DEFAULT 0,    -- 0=normal, 1=pro, 2=admin
  stripe_id        VARCHAR,
  subscription_id  VARCHAR,
  logo             VARCHAR,                    -- Supabase Storage public URL
  balance          DECIMAL(10,2) DEFAULT 0,
  paypal_id        VARCHAR,
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- Protected links
CREATE TABLE IF NOT EXISTS file_list_user (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT        REFERENCES users(id) ON DELETE CASCADE,
  dropbox_url         TEXT,                   -- comma-separated Notion/file URLs
  filename            TEXT,                   -- comma-separated display names (optional)
  passdrop_url        VARCHAR       UNIQUE NOT NULL,  -- custom slug
  passdrop_pwd        VARCHAR,                -- plain-text password (null = no password)
  service             INT           DEFAULT 3, -- 1=dropbox, 2=gdrive, 3=notion
  link_type           INT           DEFAULT 4, -- 1=single, 2=multiple, 3=folder, 4=link
  is_verified         INT           DEFAULT 0,
  alt_email           VARCHAR,
  download_count      INT           DEFAULT 0,
  expires_on          DATE,
  expire_count        INT           DEFAULT 0,
  track_ip            BOOLEAN       DEFAULT FALSE,
  email_notify        BOOLEAN       DEFAULT FALSE,
  is_paid             DECIMAL(10,2),           -- NULL=free, otherwise USD price
  paypop_title        VARCHAR,
  paypop_sub          VARCHAR,
  is_expiry_extended  BOOLEAN       DEFAULT FALSE,
  created_on          DATE          DEFAULT CURRENT_DATE,
  last_download       TIMESTAMPTZ
);

-- Per-day download counters (analytics)
CREATE TABLE IF NOT EXISTS daily_downloads (
  id             BIGSERIAL PRIMARY KEY,
  user_id        BIGINT   REFERENCES users(id),
  link_id        BIGINT   REFERENCES file_list_user(id) ON DELETE CASCADE,
  passdrop_url   VARCHAR,
  downloads      INT      DEFAULT 0,
  download_date  DATE     DEFAULT CURRENT_DATE
);

-- IP-based access tracking
CREATE TABLE IF NOT EXISTS ip_tracker (
  id       BIGSERIAL PRIMARY KEY,
  link_id  BIGINT   REFERENCES file_list_user(id) ON DELETE CASCADE,
  ip       VARCHAR,
  city     VARCHAR,
  country  VARCHAR,
  reserved VARCHAR,
  latlong  VARCHAR   -- "lat,lng"
);

-- Paid link purchases (link-level payments)
CREATE TABLE IF NOT EXISTS paid_links (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT        REFERENCES users(id),
  link_id    BIGINT        REFERENCES file_list_user(id),
  type       INT           DEFAULT 2,   -- 1=balance, 2=stripe
  amount     DECIMAL(10,2),
  status     INT           DEFAULT 0,   -- 0=pending, 1=done
  created_at TIMESTAMPTZ   DEFAULT NOW(),
  updated_at TIMESTAMPTZ   DEFAULT NOW()
);

-- Pro subscription purchase records
CREATE TABLE IF NOT EXISTS paid_membership (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT        REFERENCES users(id),
  type       INT,
  amount     DECIMAL(10,2),
  status     INT           DEFAULT 0,
  created_at TIMESTAMPTZ   DEFAULT NOW(),
  updated_at TIMESTAMPTZ   DEFAULT NOW()
);

-- Password reset tokens (1-hour expiry)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT      REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR     NOT NULL,    -- SHA-256 of the raw token sent in email
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_file_list_user_user_id    ON file_list_user(user_id);
CREATE INDEX IF NOT EXISTS idx_file_list_user_passdrop   ON file_list_user(passdrop_url);
CREATE INDEX IF NOT EXISTS idx_daily_downloads_link_date ON daily_downloads(link_id, download_date);
CREATE INDEX IF NOT EXISTS idx_ip_tracker_link_id        ON ip_tracker(link_id);
CREATE INDEX IF NOT EXISTS idx_paid_links_user_id        ON paid_links(user_id);
CREATE INDEX IF NOT EXISTS idx_paid_links_link_id        ON paid_links(link_id);
