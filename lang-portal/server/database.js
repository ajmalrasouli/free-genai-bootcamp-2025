import { Sequelize } from 'sequelize';

// Create a new Sequelize instance using SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './dari_learning.db',
  logging: false
});

// Define models
const Word = sequelize.define('Words', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dariWord: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pronunciation: {
    type: Sequelize.STRING,
    allowNull: false
  },
  englishTranslation: {
    type: Sequelize.STRING,
    allowNull: false
  },
  exampleSentence: {
    type: Sequelize.STRING,
    allowNull: false
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'WordGroups',
      key: 'id'
    }
  },
  masteryLevel: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  lastReviewed: {
    type: Sequelize.DATE
  },
  correctCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  incorrectCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

const WordGroup = sequelize.define('WordGroups', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const StudySession = sequelize.define('StudySessions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'WordGroups',
      key: 'id'
    }
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  startTime: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endTime: {
    type: Sequelize.DATE
  },
  score: {
    type: Sequelize.INTEGER
  },
  correctCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  incorrectCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

const WordReview = sequelize.define('WordReviews', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wordId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Words',
      key: 'id'
    }
  },
  sessionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'StudySessions',
      key: 'id'
    }
  },
  isCorrect: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  reviewTime: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

// Define associations
WordGroup.hasMany(Word, { foreignKey: 'groupId' });
Word.belongsTo(WordGroup, { foreignKey: 'groupId' });

WordGroup.hasMany(StudySession, { foreignKey: 'groupId' });
StudySession.belongsTo(WordGroup, { foreignKey: 'groupId' });

Word.hasMany(WordReview, { foreignKey: 'wordId' });
WordReview.belongsTo(Word, { foreignKey: 'wordId' });

StudySession.hasMany(WordReview, { foreignKey: 'sessionId' });
WordReview.belongsTo(StudySession, { foreignKey: 'sessionId' });

export {
  sequelize,
  Word,
  WordGroup,
  StudySession,
  WordReview
};
