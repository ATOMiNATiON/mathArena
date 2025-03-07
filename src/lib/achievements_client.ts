import { actions } from "astro:actions";
import { ACHIEVEMENTS } from "./achievements";

export async function updateStats(stats: {
    streak: number,
    sessionCorrect: number,
    totalCorrect: number,
    accuracy: number
}) {
    const scoreBox = document.getElementById("score-box")!;
    if(scoreBox.classList.contains("server")) {
        const unlockedAchievements = Object.values(ACHIEVEMENTS)
            .filter(achievement => {
                const isUnlocked = achievement.condition(stats);
                return isUnlocked;
            })
            .map(achievement => achievement.id);

        const response = await actions.updateStats({
            ...stats,
            achievements: unlockedAchievements
        });
    }
}
