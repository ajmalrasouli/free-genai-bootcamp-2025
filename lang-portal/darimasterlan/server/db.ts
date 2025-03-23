import Database from 'better-sqlite3';
import path from 'path';

// Create database connection
export const db = new Database('sqlite.db', {
    verbose: console.log
});

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// First drop the existing study_activities table if it exists
db.exec(`DROP TABLE IF EXISTS study_activities;`);

// Then create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dari_word TEXT NOT NULL,
        english_translation TEXT NOT NULL,
        pronunciation TEXT NOT NULL,
        example_sentence TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS word_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS words_to_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        FOREIGN KEY (word_id) REFERENCES words(id),
        FOREIGN KEY (group_id) REFERENCES word_groups(id)
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES word_groups(id)
    );

    CREATE TABLE IF NOT EXISTS word_review_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER,
        study_session_id INTEGER,
        correct BOOLEAN NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (word_id) REFERENCES words(id),
        FOREIGN KEY (study_session_id) REFERENCES study_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS study_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        thumbnail_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Add default activities
    INSERT OR IGNORE INTO study_activities (name, type, description)
    VALUES 
        ('Flashcards', 'flashcards', 'Study words with interactive flashcards'),
        ('Matching Game', 'matching', 'Match Dari words with their English translations');
`);

// Export common database operations
export const getWords = () => {
    return db.prepare('SELECT * FROM words').all();
};

export const getWordGroups = () => {
    return db.prepare(`
        SELECT 
            wg.*,
            COUNT(wtg.word_id) as word_count
        FROM word_groups wg
        LEFT JOIN words_to_groups wtg ON wg.id = wtg.group_id
        GROUP BY wg.id
    `).all();
};

export const getWordsByGroup = (groupId: number) => {
    return db.prepare(`
        SELECT w.* 
        FROM words w
        JOIN words_to_groups wtg ON w.id = wtg.word_id
        WHERE wtg.group_id = ?
    `).all(groupId);
};

export const createWord = (word: { dari_word: string; english_translation: string; pronunciation: string; example_sentence: string }) => {
    const result = db.prepare(`
        INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
        VALUES (?, ?, ?, ?)
    `).run(word.dari_word, word.english_translation, word.pronunciation, word.example_sentence);
    return { id: result.lastInsertRowid, ...word };
};

export const createWordGroup = (name: string) => {
    const result = db.prepare('INSERT INTO word_groups (name) VALUES (?)').run(name);
    return { id: result.lastInsertRowid, name };
};

export const addWordToGroup = (wordId: number, groupId: number) => {
    return db.prepare(`
        INSERT INTO words_to_groups (word_id, group_id)
        VALUES (?, ?)
    `).run(wordId, groupId);
};
