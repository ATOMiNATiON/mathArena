import { actions } from "astro:actions";
import { UserStats } from "./achievements.ts"

export async function getScore(): Promise<number> {
  const scoreBox = document.getElementById("score-box")!;
  if(scoreBox.classList.contains("server")) return await getScoreFirebase();
  else if(scoreBox.classList.contains("client")) return getScoreLocalStorage();
  else throw new Error("Score not loaded?");}

export async function getScoreFirebase(): Promise<number> {
  const score = await actions.getScore();
  return score.data!;
}

export function getScoreLocalStorage(): number {
  return parseInt(localStorage.getItem("userScore") || "0", 10);
}

export async function updateScore(change: -1 | 1) {
  const scoreBox = document.getElementById("score-box")!;
  if(scoreBox.classList.contains("server")) return await updateScoreFirebase(change);
  else if(scoreBox.classList.contains("client")) return updateScoreLocalStorage(change);
  else throw new Error("Score not loaded?");
}

function updateScoreText(change: -1 | 1): number {
  const scoreText = document.getElementById("score-text")!;
  
  const currentScore = Number(scoreText.innerText)
  let newScore = currentScore + change
  if(newScore < 0) newScore = 0;

  scoreText.innerText = newScore.toString();
  return newScore;
}

export async function updateScoreFirebase(change: -1 | 1): Promise<void> {
  updateScoreText(change);
  let newData: Partial<UserStats>;
  switch(change) {
    case -1:
      newData = (await actions.incrementIncorrect()).data!;
      break;
    case 1:
      newData = (await actions.incrementCorrect()).data!;
      break;
  }

  let stat: keyof UserStats;

  for (stat in newData) {
    // key: stat, val: newData[stat]
    if (newData[stat]) {
      localStorage.setItem(stat, newData[stat]!.toString());
    }
  }
}

export function updateScoreLocalStorage(change: -1 | 1): void {
  const newScore = updateScoreText(change);
  localStorage.setItem("userScore", newScore.toString());
}
