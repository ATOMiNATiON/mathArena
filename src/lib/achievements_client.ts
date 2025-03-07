import { actions } from "astro:actions";
import { ACHIEVEMENTS } from "./achievements";

export async function updateStats(stats: {
    streak: number,
    sessionCorrect: number,
    totalCorrect: number,
    accuracy: number
}) {
    console.log("Starting updateStats with:", stats);  // Debug log
    const scoreBox = document.getElementById("score-box")!;
    if(scoreBox.classList.contains("server")) {
        // Check which achievements are unlocked
        const unlockedAchievements = Object.values(ACHIEVEMENTS)
            .filter(achievement => {
                const isUnlocked = achievement.condition(stats);
                console.log(`Achievement ${achievement.name}:`, {
                    condition: achievement.condition.toString(),
                    stats,
                    isUnlocked
                });
                return isUnlocked;
            })
            .map(achievement => achievement.id);

        console.log('Sending achievements to server:', unlockedAchievements);

        // Send both stats and achievements to server
        const response = await actions.updateStats({
            ...stats,
            achievements: unlockedAchievements
        });
        console.log('Server response:', response);
    }
}
