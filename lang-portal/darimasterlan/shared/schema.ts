import { z } from "zod";

// Database interfaces
export interface Word {
  id: number;
  dari_word: string;
  english_translation: string;
  pronunciation: string;
  example_sentence: string;
}

export interface WordGroup {
  id: number;
  name: string;
  word_count?: number;  // Optional because it's only present in list views
}

export interface WordsToGroups {
  id: number;
  word_id: number;
  group_id: number;
}

export interface StudySession {
  id: number;
  group_id: number | null;
  created_at: string;
}

export interface WordReviewItem {
  id: number;
  word_id: number | null;
  study_session_id: number | null;
  correct: boolean;
  created_at: string;
}

// Types for inserting new records
export type InsertWord = Omit<Word, 'id'>;
export type InsertWordGroup = Omit<WordGroup, 'id'>;
export type InsertWordsToGroups = Omit<WordsToGroups, 'id'>;
export type InsertStudySession = Omit<StudySession, 'id' | 'created_at'>;
export type InsertWordReview = Omit<WordReviewItem, 'id' | 'created_at'>;

// Zod schemas for validation
export const insertWordSchema = z.object({
  dari_word: z.string(),
  english_translation: z.string(),
  pronunciation: z.string(),
  example_sentence: z.string()
});

export const insertWordGroupSchema = z.object({
  name: z.string()
});

export const insertWordsToGroupsSchema = z.object({
  word_id: z.number(),
  group_id: z.number()
});

export const insertStudySessionSchema = z.object({
  group_id: z.union([
    z.number(),
    z.string().transform(val => parseInt(val, 10)),
    z.null()
  ])
});

export const insertWordReviewSchema = z.object({
  word_id: z.number().nullable(),
  study_session_id: z.number().nullable(),
  correct: z.boolean()
});