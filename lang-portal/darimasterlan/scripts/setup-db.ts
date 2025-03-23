import { db } from '../server/db';

async function setupDatabase() {
    console.log('Setting up database...');

    try {
        // First create tables (this happens in db.ts)
        
        // Then clear existing data
        console.log('Clearing existing data...');
        db.exec(`
            DELETE FROM word_review_items;
            DELETE FROM words_to_groups;
            DELETE FROM study_sessions;
            DELETE FROM words;
            DELETE FROM word_groups;
        `);

        // Insert initial groups
        const groups = [
            "Basic Greetings",
            "Family Members",
            "Common Verbs",
            "Numbers"
        ];

        console.log('Inserting groups...');
        const insertGroup = db.prepare('INSERT INTO word_groups (name) VALUES (?)');
        groups.forEach(group => {
            console.log(`Adding group: ${group}`);
            insertGroup.run(group);
        });

        // Insert initial words
        const words = [
            // Basic Greetings
            {
                dari_word: "سلام",
                english_translation: "Hello",
                pronunciation: "Salaam",
                example_sentence: "سلام، چطور استی؟",
                group: "Basic Greetings"
            },
            {
                dari_word: "خوب",
                english_translation: "Good",
                pronunciation: "Khub",
                example_sentence: "من خوب استم",
                group: "Basic Greetings"
            },
            {
                dari_word: "تشکر",
                english_translation: "Thank you",
                pronunciation: "Tashakor",
                example_sentence: "تشکر از شما",
                group: "Basic Greetings"
            },
            // Family Members
            {
                dari_word: "پدر",
                english_translation: "Father",
                pronunciation: "Padar",
                example_sentence: "پدر من داکتر است",
                group: "Family Members"
            },
            {
                dari_word: "مادر",
                english_translation: "Mother",
                pronunciation: "Maadar",
                example_sentence: "مادر من معلم است",
                group: "Family Members"
            },
            {
                dari_word: "برادر",
                english_translation: "Brother",
                pronunciation: "Baraadar",
                example_sentence: "برادر من مکتب میرود",
                group: "Family Members"
            },
            // Common Verbs
            {
                dari_word: "رفتن",
                english_translation: "To go",
                pronunciation: "Raftan",
                example_sentence: "من به مکتب میروم",
                group: "Common Verbs"
            },
            {
                dari_word: "خوردن",
                english_translation: "To eat",
                pronunciation: "Khordan",
                example_sentence: "من نان میخورم",
                group: "Common Verbs"
            },
            {
                dari_word: "دیدن",
                english_translation: "To see",
                pronunciation: "Didan",
                example_sentence: "من تو را میبینم",
                group: "Common Verbs"
            },
            // Numbers
            {
                dari_word: "یک",
                english_translation: "One",
                pronunciation: "Yak",
                example_sentence: "من یک کتاب دارم",
                group: "Numbers"
            },
            {
                dari_word: "دو",
                english_translation: "Two",
                pronunciation: "Du",
                example_sentence: "دو برادر دارم",
                group: "Numbers"
            },
            {
                dari_word: "سه",
                english_translation: "Three",
                pronunciation: "Se",
                example_sentence: "سه ساعت درس خواندم",
                group: "Numbers"
            }
        ];

        console.log('Inserting words...');
        const insertWord = db.prepare(`
            INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
            VALUES (?, ?, ?, ?)
        `);

        const insertWordToGroup = db.prepare(`
            INSERT INTO words_to_groups (word_id, group_id)
            VALUES ((SELECT id FROM words WHERE dari_word = ?), (SELECT id FROM word_groups WHERE name = ?))
        `);

        words.forEach(word => {
            console.log(`Adding word: ${word.dari_word}`);
            insertWord.run(
                word.dari_word,
                word.english_translation,
                word.pronunciation,
                word.example_sentence
            );
            insertWordToGroup.run(word.dari_word, word.group);
        });

        console.log('Database setup complete!');
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase(); 