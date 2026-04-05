import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'server', 'database', 'data.db')

const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    emoji TEXT NOT NULL,
    title TEXT NOT NULL,
    preview TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    baobao INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL,
    parent_id TEXT DEFAULT NULL,
    content TEXT NOT NULL,
    avatar TEXT NOT NULL,
    nickname TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_stories_date ON stories(date DESC);
  CREATE INDEX IF NOT EXISTS idx_comments_story ON comments(story_id);
  CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
`)

export default db
