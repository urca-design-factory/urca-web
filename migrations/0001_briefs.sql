-- One row per submitted project brief.
-- Contact details are kept in columns for quick listing; every answer,
-- including those, is stored as JSON in `answers`. No IP address or user agent.
CREATE TABLE IF NOT EXISTS briefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  email TEXT NOT NULL,
  answers TEXT NOT NULL,
  consent_version TEXT NOT NULL
);
