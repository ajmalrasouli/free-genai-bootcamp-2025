import { db } from '../server/db';

// Add numbers 1-20 in Dari
const numberWords = [
  {
    dari_word: "یک",
    english_translation: "One",
    pronunciation: "yak",
    example_sentence: "من یک کتاب دارم",
  },
  {
    dari_word: "دو",
    english_translation: "Two",
    pronunciation: "do",
    example_sentence: "دو نفر آمدند",
  },
  {
    dari_word: "سه",
    english_translation: "Three",
    pronunciation: "se",
    example_sentence: "سه ساعت گذشت",
  },
  {
    dari_word: "چهار",
    english_translation: "Four",
    pronunciation: "chahār",
    example_sentence: "چهار روز باقی مانده",
  },
  {
    dari_word: "پنج",
    english_translation: "Five",
    pronunciation: "panj",
    example_sentence: "پنج دقیقه صبر کن",
  },
  {
    dari_word: "شش",
    english_translation: "Six",
    pronunciation: "shesh",
    example_sentence: "شش ماه گذشت",
  },
  {
    dari_word: "هفت",
    english_translation: "Seven",
    pronunciation: "haft",
    example_sentence: "هفت روز در هفته",
  },
  {
    dari_word: "هشت",
    english_translation: "Eight",
    pronunciation: "hasht",
    example_sentence: "هشت ساعت کار کردم",
  },
  {
    dari_word: "نه",
    english_translation: "Nine",
    pronunciation: "noh",
    example_sentence: "ساعت نه صبح",
  },
  {
    dari_word: "ده",
    english_translation: "Ten",
    pronunciation: "dah",
    example_sentence: "ده نفر در صنف هستند",
  },
  {
    dari_word: "یازده",
    english_translation: "Eleven",
    pronunciation: "yāzdah",
    example_sentence: "ساعت یازده شب",
  },
  {
    dari_word: "دوازده",
    english_translation: "Twelve",
    pronunciation: "davāzdah",
    example_sentence: "دوازده ماه در سال",
  },
  {
    dari_word: "سیزده",
    english_translation: "Thirteen",
    pronunciation: "sēzdah",
    example_sentence: "سیزده نفر آمدند",
  },
  {
    dari_word: "چهارده",
    english_translation: "Fourteen",
    pronunciation: "chahārdah",
    example_sentence: "چهارده سال عمر دارد",
  },
  {
    dari_word: "پانزده",
    english_translation: "Fifteen",
    pronunciation: "pānzdah",
    example_sentence: "پانزده دقیقه انتظار کشیدم",
  },
  {
    dari_word: "شانزده",
    english_translation: "Sixteen",
    pronunciation: "shānzdah",
    example_sentence: "شانزده کتاب خریدم",
  },
  {
    dari_word: "هفده",
    english_translation: "Seventeen",
    pronunciation: "hefdah",
    example_sentence: "هفده سال سن دارد",
  },
  {
    dari_word: "هجده",
    english_translation: "Eighteen",
    pronunciation: "hejdah",
    example_sentence: "هجده سال پیش",
  },
  {
    dari_word: "نوزده",
    english_translation: "Nineteen",
    pronunciation: "nōzdah",
    example_sentence: "نوزده روز گذشت",
  },
  {
    dari_word: "بیست",
    english_translation: "Twenty",
    pronunciation: "bist",
    example_sentence: "بیست نفر در صنف هستند",
  },
];

// Add family members
const familyWords = [
  {
    dari_word: "پدر",
    english_translation: "Father",
    pronunciation: "padar",
    example_sentence: "پدر من معلم است",
  },
  {
    dari_word: "مادر",
    english_translation: "Mother",
    pronunciation: "mādar",
    example_sentence: "مادر من در خانه است",
  },
  {
    dari_word: "برادر",
    english_translation: "Brother",
    pronunciation: "barādar",
    example_sentence: "برادر من دانشجو است",
  },
  {
    dari_word: "خواهر",
    english_translation: "Sister",
    pronunciation: "khwāhar",
    example_sentence: "خواهر من داکتر است",
  },
  {
    dari_word: "پسر",
    english_translation: "Son",
    pronunciation: "pesar",
    example_sentence: "پسر من به مکتب میرود",
  },
  {
    dari_word: "دختر",
    english_translation: "Daughter",
    pronunciation: "dokhtar",
    example_sentence: "دختر من کتاب میخواند",
  },
  {
    dari_word: "کاکا",
    english_translation: "Uncle",
    pronunciation: "kākā",
    example_sentence: "کاکایم در کابل زندگی میکند",
  },
  {
    dari_word: "ماما",
    english_translation: "Maternal Uncle",
    pronunciation: "māmā",
    example_sentence: "مامایم معلم است",
  },
  {
    dari_word: "خاله",
    english_translation: "Maternal Aunt",
    pronunciation: "khāla",
    example_sentence: "خاله ام در هرات است",
  },
  {
    dari_word: "عمه",
    english_translation: "Paternal Aunt",
    pronunciation: "ama",
    example_sentence: "عمه ام داکتر است",
  }
];

// Add basic phrases
const basicPhrases = [
  {
    dari_word: "سلام",
    english_translation: "Hello",
    pronunciation: "salām",
    example_sentence: "سلام، چطور هستی؟",
  },
  {
    dari_word: "خداحافظ",
    english_translation: "Goodbye",
    pronunciation: "khudā hāfiz",
    example_sentence: "خداحافظ، به امید دیدار",
  },
  {
    dari_word: "تشکر",
    english_translation: "Thank you",
    pronunciation: "tashakor",
    example_sentence: "تشکر از کمک تان",
  },
  {
    dari_word: "خواهش میکنم",
    english_translation: "You're welcome",
    pronunciation: "khāhesh mekonam",
    example_sentence: "خواهش میکنم، این وظیفه من است",
  },
  {
    dari_word: "بلی",
    english_translation: "Yes",
    pronunciation: "balē",
    example_sentence: "بلی، من موافق هستم",
  },
  {
    dari_word: "نی",
    english_translation: "No",
    pronunciation: "nē",
    example_sentence: "نی، من نمی توانم",
  },
  {
    dari_word: "لطفاً",
    english_translation: "Please",
    pronunciation: "lutfan",
    example_sentence: "لطفاً یک گیلاس آب بیاورید",
  },
  {
    dari_word: "ببخشید",
    english_translation: "Excuse me/Sorry",
    pronunciation: "bebakhshēd",
    example_sentence: "ببخشید، من دیر کردم",
  }
];

// Add common phrases
const commonPhrases = [
  {
    dari_word: "چطور هستی؟",
    english_translation: "How are you?",
    pronunciation: "chetor hastē?",
    example_sentence: "سلام، چطور هستی؟",
  },
  {
    dari_word: "خوب هستم",
    english_translation: "I am fine",
    pronunciation: "khūb hastam",
    example_sentence: "تشکر، خوب هستم",
  },
  {
    dari_word: "نام شما چیست؟",
    english_translation: "What is your name?",
    pronunciation: "nām-e shumā chēst?",
    example_sentence: "ببخشید، نام شما چیست؟",
  },
  {
    dari_word: "نام من ... است",
    english_translation: "My name is ...",
    pronunciation: "nām-e man ... ast",
    example_sentence: "نام من احمد است",
  },
  {
    dari_word: "از کجا هستید؟",
    english_translation: "Where are you from?",
    pronunciation: "az kujā hastēd?",
    example_sentence: "شما از کجا هستید؟",
  },
  {
    dari_word: "من از افغانستان هستم",
    english_translation: "I am from Afghanistan",
    pronunciation: "man az afghānistān hastam",
    example_sentence: "من از افغانستان هستم، از کابل",
  },
  {
    dari_word: "خوش آمدید",
    english_translation: "Welcome",
    pronunciation: "khosh āmadēd",
    example_sentence: "به خانه ما خوش آمدید",
  },
  {
    dari_word: "به امید دیدار",
    english_translation: "See you later",
    pronunciation: "ba omēd-e dēdār",
    example_sentence: "خداحافظ، به امید دیدار",
  },
  {
    dari_word: "من نمی فهمم",
    english_translation: "I don't understand",
    pronunciation: "man namēfahmam",
    example_sentence: "ببخشید، من نمی فهمم",
  },
  {
    dari_word: "میتوانید تکرار کنید؟",
    english_translation: "Can you repeat that?",
    pronunciation: "mētawānēd tekrār konēd?",
    example_sentence: "ببخشید، میتوانید تکرار کنید؟",
  }
];

async function seed() {
  try {
    // Clear existing data in the correct order
    db.exec(`
      -- First delete child tables that have foreign keys
      DELETE FROM word_review_items;
      DELETE FROM words_to_groups;
      DELETE FROM study_sessions;
      
      -- Then delete parent tables
      DELETE FROM words;
      DELETE FROM word_groups;
      DELETE FROM study_activities;
      
      -- Re-add default activities
      INSERT INTO study_activities (name, type, description)
      VALUES 
        ('Flashcards', 'flashcards', 'Study words with interactive flashcards'),
        ('Matching Game', 'matching', 'Match Dari words with their English translations');
    `);

    // Create word groups
    const groups = [
      { name: 'Numbers', words: numberWords },
      { name: 'Family Members', words: familyWords },
      { name: 'Basic Phrases', words: basicPhrases },
      { name: 'Common Phrases', words: commonPhrases }
    ];

    // Add each group and its words
    for (const group of groups) {
      const groupResult = db.prepare(
        'INSERT INTO word_groups (name) VALUES (?)'
      ).run(group.name);
      
      const groupId = groupResult.lastInsertRowid;

      // Add all words for this group
      for (const word of group.words) {
        const wordResult = db.prepare(`
          INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
          VALUES (?, ?, ?, ?)
        `).run(
          word.dari_word,
          word.english_translation,
          word.pronunciation,
          word.example_sentence
        );

        // Link word to group
        db.prepare(`
          INSERT INTO words_to_groups (word_id, group_id)
          VALUES (?, ?)
        `).run(wordResult.lastInsertRowid, groupId);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();