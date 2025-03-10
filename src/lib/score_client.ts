import { actions } from "astro:actions";

export async function getScore(): Promise<number> {
  const scoreBox = document.getElementById("score-box")!;
  if (scoreBox.classList.contains("server")) return await getScoreFirebase();
  else if (scoreBox.classList.contains("client")) return getScoreLocalStorage();
  else throw new Error("Score not loaded?");
}

export async function getScoreFirebase(): Promise<number> {
  const score = await actions.getScore();
  return score.data!;
}

export function getScoreLocalStorage(): number {
  return parseInt(localStorage.getItem("userScore") || "0", 10);
}

export async function updateScore(change: number) {
  const scoreBox = document.getElementById("score-box")!;
  if (scoreBox.classList.contains("server"))
    return await updateScoreFirebase(change);
  else if (scoreBox.classList.contains("client"))
    return updateScoreLocalStorage(change);
  else throw new Error("Score not loaded?");
}
function updateScoreText(change: number): number {
  const scoreText = document.getElementById("score-text")!;

  const currentScore = Number(scoreText.innerText);
  let newScore = currentScore + change;
  if (newScore < 0) newScore = 0;

  scoreText.innerText = newScore.toString();
  return newScore;
}

export async function updateScoreFirebase(change: number): Promise<void> {
  const newScore = updateScoreText(change);
  await actions.updateScore(newScore);
}

export function updateScoreLocalStorage(change: number): void {
  const newScore = updateScoreText(change);
  localStorage.setItem("userScore", newScore.toString());
}
