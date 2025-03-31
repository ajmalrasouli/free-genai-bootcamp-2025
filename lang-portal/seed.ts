import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { words, wordGroups, wordsToGroups } from './shared/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function seed() {
  // First, let's create some word groups
  const groups = await db.insert(wordGroups).values([
    { name: "Basic Greetings" },
    { name: "Family Members" },
    { name: "Common Verbs" },
    { name: "Numbers" }
  ]).returning();

  // Now let's add some words
  const wordsList = await db.insert(words).values([
    {
      dariWord: "سلام",
      englishTranslation: "Hello",
      pronunciation: "Salaam",
      exampleSentence: "سلام، چطور استی؟"
    },
    {
      dariWord: "خوب",
      englishTranslation: "Good",
      pronunciation: "Khub",
      exampleSentence: "من خوب استم"
    },
    {
      dariWord: "تشکر",
      englishTranslation: "Thank you",
      pronunciation: "Tashakor",
      exampleSentence: "تشکر از شما"
    },
    {
      dariWord: "پدر",
      englishTranslation: "Father",
      pronunciation: "Padar",
      exampleSentence: "پدر من داکتر است"
    },
    {
      dariWord: "مادر",
      englishTranslation: "Mother",
      pronunciation: "Maadar",
      exampleSentence: "مادر من معلم است"
    },
    {
      dariWord: "برادر",
      englishTranslation: "Brother",
      pronunciation: "Biraadar",
      exampleSentence: "برادر من در کابل است"
    },
    {
      dariWord: "رفتن",
      englishTranslation: "To go",
      pronunciation: "Raftan",
      exampleSentence: "من به مکتب میروم"
    },
    {
      dariWord: "خوردن",
      englishTranslation: "To eat",
      pronunciation: "Khordan",
      exampleSentence: "من نان میخورم"
    },
    {
      dariWord: "یک",
      englishTranslation: "One",
      pronunciation: "Yak",
      exampleSentence: "من یک کتاب دارم"
    },
    {
      dariWord: "دو",
      englishTranslation: "Two",
      pronunciation: "Du",
      exampleSentence: "دو برادر دارم"
    }
  ]).returning();

  // Associate words with groups
  const greetingsGroup = groups[0];
  const familyGroup = groups[1];
  const verbsGroup = groups[2];
  const numbersGroup = groups[3];

  // Add word-group associations
  await db.insert(wordsToGroups).values([
    // Greetings
    { wordId: wordsList[0].id, groupId: greetingsGroup.id }, // سلام
    { wordId: wordsList[1].id, groupId: greetingsGroup.id }, // خوب
    { wordId: wordsList[2].id, groupId: greetingsGroup.id }, // تشکر

    // Family members
    { wordId: wordsList[3].id, groupId: familyGroup.id }, // پدر
    { wordId: wordsList[4].id, groupId: familyGroup.id }, // مادر
    { wordId: wordsList[5].id, groupId: familyGroup.id }, // برادر

    // Verbs
    { wordId: wordsList[6].id, groupId: verbsGroup.id }, // رفتن
    { wordId: wordsList[7].id, groupId: verbsGroup.id }, // خوردن

    // Numbers
    { wordId: wordsList[8].id, groupId: numbersGroup.id }, // یک
    { wordId: wordsList[9].id, groupId: numbersGroup.id }, // دو
  ]);

  console.log('Database seeded successfully!');
}

seed().catch(console.error); 