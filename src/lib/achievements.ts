import { z } from "astro:schema";

export interface Achievement {
    name: string;
    description: string;
    condition: (stats: Partial<UserStats>) => boolean;
}

export const UserStats = z.object({
    streak: z.number(),
    totalCorrect: z.number(),
    totalIncorrect: z.number(),
    accuracy: z.number(),
    score: z.number(),
    achievements: z.array(z.string()).optional()
});

export type UserStats = z.infer<typeof UserStats>;

export const ACHIEVEMENTS: Record<string, Achievement> = {
    first_point: {
        name: 'First Point',
        description: 'Get your first correct answer.',
        condition: (stats) => stats.totalCorrect && (stats.totalCorrect >= 1) || false
    },
    streak3: {
        name: 'Triple Streak',
        description: 'Get 3 correct answers in a row.',
        condition: (stats) => stats.streak && (stats.streak >= 3) || false
        
    },
    streak10: {
        name: 'Deca Streak',
        description: 'Get 10 correct answers in a row.',
        condition: (stats) => stats.streak && (stats.streak >= 10) || false

    },
    streak50: {
        name: 'Ultra Streak',
        description: 'Get 50 correct answers in a row.',
        condition: (stats) => stats.streak && (stats.streak >= 50) || false
    },
    streak250: {
        name: 'Unstoppable',
        description: 'Get 250 correct answers in a row.',
        condition: (stats) => stats.streak && (stats.streak >= 250) || false
    },
    total20: {
        name: 'Getting Started',
        description: 'Get 20 total correct answers.',
        condition: (stats) => stats.totalCorrect && (stats.totalCorrect >= 20) || false
    },
    total50: {
        name: 'Math Enthusiast',
        description: 'Get 50 total correct answers.',
        condition: (stats) => stats.totalCorrect && (stats.totalCorrect >= 50) || false
    },
    total100: {
        name: 'Century Club',
        description: 'Get 100 total correct answers.',
        condition: (stats) => stats.totalCorrect && (stats.totalCorrect >= 100) || false
    },
    total2000: {
        name: 'Math Master',
        description: 'Get 2000 total correct answers.',
        condition: (stats) => stats.totalCorrect && (stats.totalCorrect >= 2000) || false
    }
};
