import sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RunResult {
  lastID: number;
  changes: number;
}

export interface Database {
  run(sql: string, params?: any[]): Promise<RunResult>;
  get<T = any>(sql: string, params?: any[]): Promise<T | null>;
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  close(): Promise<void>;
}

let db: Database;

async function initDb(): Promise<void> {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    }) as unknown as Database;

    await db.run(`
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dariWord TEXT NOT NULL,
        englishTranslation TEXT NOT NULL,
        pronunciation TEXT NOT NULL,
        exampleSentence TEXT NOT NULL
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS words_to_groups (
        wordId INTEGER NOT NULL,
        groupId INTEGER NOT NULL,
        FOREIGN KEY (wordId) REFERENCES words (id),
        FOREIGN KEY (groupId) REFERENCES groups (id),
        PRIMARY KEY (wordId, groupId)
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        groupId INTEGER NOT NULL,
        date TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (groupId) REFERENCES groups (id)
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS word_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wordId INTEGER NOT NULL,
        sessionId INTEGER NOT NULL,
        correct BOOLEAN NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (wordId) REFERENCES words (id),
        FOREIGN KEY (sessionId) REFERENCES study_sessions (id)
      )
    `);
  }
}

await initDb();

export { db };
