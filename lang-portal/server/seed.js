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
        dari: 'یک',
        phonetic: 'yak',
        english: 'One',
        notes: 'من یک کتاب دارم',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'دو',
        phonetic: 'do',
        english: 'Two',
        notes: 'دو نفر آمدند',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'سه',
        phonetic: 'se',
        english: 'Three',
        notes: 'سه ساعت گذشت',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'چهار',
        phonetic: 'chahār',
        english: 'Four',
        notes: 'چهار روز باقی مانده',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'پنج',
        phonetic: 'panj',
        english: 'Five',
        notes: 'پنج دقیقه صبر کن',
        groupId: wordGroups[0].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    const familyMembers = await Promise.all([
      Word.create({
        dari: 'پدر',
        phonetic: 'padar',
        english: 'Father',
        notes: 'پدر من دکتر است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'مادر',
        phonetic: 'mādar',
        english: 'Mother',
        notes: 'مادر من معلم است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'برادر',
        phonetic: 'barādar',
        english: 'Brother',
        notes: 'برادر من در دانشگاه درس می‌خواند',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'خواهر',
        phonetic: 'khāhar',
        english: 'Sister',
        notes: 'خواهر من مهندس است',
        groupId: wordGroups[1].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    const basicPhrases = await Promise.all([
      Word.create({
        dari: 'سلام',
        phonetic: 'salām',
        english: 'Hello',
        notes: 'سلام، حال شما چطور است؟',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'خوشحالم',
        phonetic: 'khoshhālam',
        english: 'I am well',
        notes: 'من خوشحالم، ممنون',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'ممنون',
        phonetic: 'mamnūn',
        english: 'Thank you',
        notes: 'ممنون از کمک شما',
        groupId: wordGroups[2].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
    ]);

    // Add words for Common Phrases (groupId: wordGroups[3].id)
    const commonPhrases = await Promise.all([
      Word.create({
        dari: 'چطور هستی؟',
        phonetic: 'chetor hasti?',
        english: 'How are you?',
        notes: 'A common greeting.',
        groupId: wordGroups[3].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'اسم شما چیست؟',
        phonetic: 'esm-e shomā chist?',
        english: 'What is your name?',
        notes: '',
        groupId: wordGroups[3].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'بله',
        phonetic: 'bale',
        english: 'Yes',
        notes: '',
        groupId: wordGroups[3].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      }),
      Word.create({
        dari: 'نخیر',
        phonetic: 'na khair',
        english: 'No',
        notes: 'Formal way to say no.',
        groupId: wordGroups[3].id,
        masteryLevel: 1,
        correctCount: 0,
        incorrectCount: 0
      })
      // Add more common phrases here if needed
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
        timestamp: new Date('2025-04-01T18:05:00.000Z')
      }),
      WordReview.create({
        wordId: numbers[1].id,
        sessionId: studySession.id,
        isCorrect: true,
        timestamp: new Date('2025-04-01T18:06:00.000Z')
      }),
      WordReview.create({
        wordId: numbers[2].id,
        sessionId: studySession.id,
        isCorrect: true,
        timestamp: new Date('2025-04-01T18:07:00.000Z')
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
