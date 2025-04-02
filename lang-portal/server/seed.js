import { sequelize, WordGroup, Word, StudySession, WordReview } from './database.js';

async function seedDatabase() {
  try {
    // Sync the database to ensure all tables are created
    await sequelize.sync({ force: true });

    // Create word groups
    const wordGroups = await Promise.all([
      WordGroup.create({
        name: 'Numbers',
        description: 'Basic numbers in Persian'
      }),
      WordGroup.create({
        name: 'Family Members',
        description: 'Family-related vocabulary'
      }),
      WordGroup.create({
        name: 'Basic Phrases',
        description: 'Common phrases and greetings'
      }),
      WordGroup.create({
        name: 'Common Phrases',
        description: 'Everyday conversation phrases'
      })
    ]);

    // Create words for each group
    const numbers = await Promise.all([
      Word.create({
        dariWord: 'یک',
        pronunciation: 'yak',
        englishTranslation: 'One',
        exampleSentence: 'من یک کتاب دارم',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'دو',
        pronunciation: 'do',
        englishTranslation: 'Two',
        exampleSentence: 'دو نفر آمدند',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'سه',
        pronunciation: 'se',
        englishTranslation: 'Three',
        exampleSentence: 'سه ساعت گذشت',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'چهار',
        pronunciation: 'chahār',
        englishTranslation: 'Four',
        exampleSentence: 'چهار روز باقی مانده',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'پنج',
        pronunciation: 'panj',
        englishTranslation: 'Five',
        exampleSentence: 'پنج دقیقه صبر کن',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    const familyMembers = await Promise.all([
      Word.create({
        dariWord: 'پدر',
        pronunciation: 'padar',
        englishTranslation: 'Father',
        exampleSentence: 'پدر من دکتر است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'مادر',
        pronunciation: 'mādar',
        englishTranslation: 'Mother',
        exampleSentence: 'مادر من معلم است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'برادر',
        pronunciation: 'barādar',
        englishTranslation: 'Brother',
        exampleSentence: 'برادر من در دانشگاه درس می‌خواند',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'خواهر',
        pronunciation: 'khāhar',
        englishTranslation: 'Sister',
        exampleSentence: 'خواهر من مهندس است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    const basicPhrases = await Promise.all([
      Word.create({
        dariWord: 'سلام',
        pronunciation: 'salām',
        englishTranslation: 'Hello',
        exampleSentence: 'سلام، حال شما چطور است؟',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'خوشحالم',
        pronunciation: 'khoshhālam',
        englishTranslation: 'I am well',
        exampleSentence: 'من خوشحالم، ممنون',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dariWord: 'ممنون',
        pronunciation: 'mamnūn',
        englishTranslation: 'Thank you',
        exampleSentence: 'ممنون از کمک شما',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    // Create initial study session
    const studySession = await StudySession.create({
      groupId: wordGroups[0].id,
      groupName: 'Numbers',
      startTime: new Date('2025-04-01T18:00:00.000Z'),
      endTime: new Date('2025-04-01T18:10:00.000Z'),
      score: 85,
      correctCount: 7,
      incorrectCount: 2
    });

    // Create some word reviews
    await Promise.all([
      WordReview.create({
        wordId: numbers[0].id,
        sessionId: studySession.id,
        isCorrect: true,
        reviewTime: new Date('2025-04-01T18:05:00.000Z')
      }),
      WordReview.create({
        wordId: numbers[1].id,
        sessionId: studySession.id,
        isCorrect: true,
        reviewTime: new Date('2025-04-01T18:06:00.000Z')
      }),
      WordReview.create({
        wordId: numbers[2].id,
        sessionId: studySession.id,
        isCorrect: true,
        reviewTime: new Date('2025-04-01T18:07:00.000Z')
      })
    ]);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
