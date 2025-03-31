import Database from 'better-sqlite3';

try {
  const db = new Database('sqlite.db');

  console.log('\n=== Words ===');
  try {
    const words = db.prepare('SELECT * FROM words').all();
    console.table(words);
  } catch (error) {
    console.log('No words table found. Please run npm run db:setup first');
  }

  console.log('\n=== Word Groups ===');
  try {
    const groups = db.prepare('SELECT * FROM word_groups').all();
    console.table(groups);
  } catch (error) {
    console.log('No word_groups table found. Please run npm run db:setup first');
  }

  console.log('\n=== Words in Groups ===');
  try {
    const wordsInGroups = db.prepare(`
      SELECT w.*, wg.name as group_name 
      FROM words w 
      JOIN words_to_groups wtg ON w.id = wtg.word_id 
      JOIN word_groups wg ON wg.id = wtg.group_id
    `).all();
    console.table(wordsInGroups);
  } catch (error) {
    console.log('No word associations found. Please run npm run db:setup first');
  }
} catch (error) {
  console.error('Database error:', error);
  console.log('\nPlease run npm run db:setup to initialize the database');
} 