import { UserStats, ACHIEVEMENTS } from "../lib/achievements.ts";

export function updateAchievementServer(stats: Partial<UserStats>): string [] {
    
    return Object.entries(ACHIEVEMENTS)
                 .filter(([_, achievement]) => achievement.condition(stats))
                 .map(([id, _]) => id)

}

