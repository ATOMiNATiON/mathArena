export interface Achievement {
    id: string;
    name: string;
    description: string;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    streak: number;
    sessionCorrect: number;
    totalCorrect: number;
    accuracy: number;
    lastAnswerTime?: number;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    first_point: {
        id: 'First Point',
        name: 'First Point',
        description: 'Get your first correct answer.',
        condition: (stats) => stats.totalCorrect >= 1
    },
    streak3: {
        id: 'Triple Streak',
        name: 'Triple Streak',
        description: 'Get 3 correct answers in a row.',
        condition: (stats) => stats.streak >= 3
    },
    streak10: {
        id: 'Deca Streak',
        name: 'Deca Streak',
        description: 'Get 10 correct answers in a row.',
        condition: (stats) => stats.streak >= 10
    },
    streak50: {
        id: 'Ultra Streak',
        name: 'Ultra Streak',
        description: 'Get 50 correct answers in a row.',
        condition: (stats) => stats.streak >= 50
    },
    streak250: {
        id: 'Unstoppable',
        name: 'Unstoppable',
        description: 'Get 250 correct answers in a row.',
        condition: (stats) => stats.streak >= 250
    },
    total20: {
        id: 'Getting Started',
        name: 'Getting Started',
        description: 'Get 20 total correct answers.',
        condition: (stats) => stats.totalCorrect >= 20
    },
    total50: {
        id: 'Math Enthusiast',
        name: 'Math Enthusiast',
        description: 'Get 50 total correct answers.',
        condition: (stats) => stats.totalCorrect >= 50
    },
    total100: {
        id: 'Century Club',
        name: 'Century Club',
        description: 'Get 100 total correct answers.',
        condition: (stats) => stats.totalCorrect >= 100
    },
    total2000: {
        id: 'Math Master',
        name: 'Math Master',
        description: 'Get 2000 total correct answers.',
        condition: (stats) => stats.totalCorrect >= 2000
    }
};
