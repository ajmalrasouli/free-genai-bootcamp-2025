import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Changed path to be relative to server dir
  logging: false // Set to console.log for debugging SQL
});

// Define interfaces for model attributes
interface WordAttributes extends Model<InferAttributes<WordAttributes>, InferCreationAttributes<WordAttributes>> {
  id: CreationOptional<number>;
  groupId: number;
  dari: string;
  english: string;
  phonetic: string | null;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WordGroupAttributes extends Model<InferAttributes<WordGroupAttributes>, InferCreationAttributes<WordGroupAttributes>> {
  id: CreationOptional<number>;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StudySessionAttributes extends Model<InferAttributes<StudySessionAttributes>, InferCreationAttributes<StudySessionAttributes>> {
  id: CreationOptional<number>;
  groupId: number;
  groupName: string; // Added this based on usage in index.ts
  startTime: Date;
  endTime: CreationOptional<Date | null>;
  score: CreationOptional<number | null>;
  correctCount: CreationOptional<number | null>;
  incorrectCount: CreationOptional<number | null>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WordReviewAttributes extends Model<InferAttributes<WordReviewAttributes>, InferCreationAttributes<WordReviewAttributes>> {
  id: CreationOptional<number>;
  sessionId: number;
  wordId: number;
  isCorrect: boolean;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Model Classes using modern TS approach

// --- WordGroup Model ---
class WordGroup extends Model<InferAttributes<WordGroup>, InferCreationAttributes<WordGroup>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  // Timestamps are added by default
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

WordGroup.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, modelName: 'WordGroup' });

// --- Word Model ---
class Word extends Model<InferAttributes<Word>, InferCreationAttributes<Word>> {
  declare id: CreationOptional<number>;
  declare groupId: number; // Foreign Key
  declare dari: string;
  declare english: string;
  declare phonetic: string | null;
  declare notes: string | null;
  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Word.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: WordGroup, key: 'id' } // Added FK reference
  },
  dari: {
    type: DataTypes.STRING,
    allowNull: false
  },
  english: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phonetic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, modelName: 'Word' });

// --- StudySession Model ---
class StudySession extends Model<InferAttributes<StudySession>, InferCreationAttributes<StudySession>> {
  declare id: CreationOptional<number>;
  declare groupId: number; // Foreign Key
  declare groupName: string; // Added this based on usage in index.ts
  declare startTime: Date;
  declare endTime: CreationOptional<Date | null>;
  declare score: CreationOptional<number | null>;
  declare correctCount: CreationOptional<number | null>;
  declare incorrectCount: CreationOptional<number | null>;
  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

StudySession.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: WordGroup, key: 'id' } // Added FK reference
  },
  groupName: { // If keeping this field
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  correctCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  incorrectCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, modelName: 'StudySession' });

// --- WordReview Model ---
class WordReview extends Model<InferAttributes<WordReview>, InferCreationAttributes<WordReview>> {
  declare id: CreationOptional<number>;
  declare sessionId: number; // Foreign Key
  declare wordId: number; // Foreign Key
  declare isCorrect: boolean;
  declare timestamp: Date;
  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

WordReview.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: StudySession, key: 'id' } // Added FK reference
  },
  wordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Word, key: 'id' } // Added FK reference
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize, modelName: 'WordReview' });

// Define Associations (after all models are initialized)
WordGroup.hasMany(Word, { foreignKey: 'groupId' });
Word.belongsTo(WordGroup, { foreignKey: 'groupId' });

WordGroup.hasMany(StudySession, { foreignKey: 'groupId' }); // Added this association
StudySession.belongsTo(WordGroup, { foreignKey: 'groupId' });

StudySession.hasMany(WordReview, { foreignKey: 'sessionId' });
WordReview.belongsTo(StudySession, { foreignKey: 'sessionId' });

Word.hasMany(WordReview, { foreignKey: 'wordId' });
WordReview.belongsTo(Word, { foreignKey: 'wordId' });

export {
  sequelize,
  Word,
  WordGroup,
  StudySession,
  WordReview,
  // Export types if needed elsewhere
  WordAttributes,
  WordGroupAttributes,
  StudySessionAttributes,
  WordReviewAttributes
};
