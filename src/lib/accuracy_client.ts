import { actions } from "astro:actions";

export async function getAccuracy(): Promise<number> {
  const AccuracyBox = document.getElementById("accuracy-box")!;
  if (AccuracyBox.classList.contains("server")) return await getAccuracyFirebase();
  else if (AccuracyBox.classList.contains("client")) return getAccuracyLocalStorage();
  else throw new Error("Accuracy not loaded?");
}

export async function getAccuracyFirebase(): Promise<number> {
  const accuracy = await actions.getAccuracy();
  return accuracy.data!;
}

export function getAccuracyLocalStorage(): number {
    const correctCount = parseInt(localStorage.getItem("totalCorrect") || "0", 10);
    const incorrectCount = parseInt(localStorage.getItem("totalIncorrect") || "0", 10);
    const totalAnswers = correctCount + incorrectCount;
    const accuracy = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
    return accuracy;
}

export async function updateAccuracy(correctChange: number, incorrectChange: number) {
  const AccuracyBox = document.getElementById("accuracy-box")!;
  if (AccuracyBox.classList.contains("client")) return updateAccuracyLocalStorage(correctChange, incorrectChange);
  else updateAccuracyText(correctChange, incorrectChange);
}

function updateAccuracyText(correctChange: number, incorrectChange: number): number {
  const AccuracyText = document.getElementById("accuracy-text")!;

  let correctCount = parseInt(localStorage.getItem("totalCorrect") || "0", 10);
  let incorrectCount = parseInt(localStorage.getItem("totalIncorrect") || "0", 10);

  correctCount += correctChange;
  incorrectCount += incorrectChange;

  localStorage.setItem("totalCorrect", correctCount.toString());
  localStorage.setItem("totalIncorrect", incorrectCount.toString());

  const total = correctCount + incorrectCount;
  const newAccuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  AccuracyText.innerText = `${newAccuracy}%`;
  return newAccuracy;
}

export function updateAccuracyLocalStorage(correctChange: number, incorrectChange: number): void {
  const newAccuracy = updateAccuracyText(correctChange, incorrectChange);
  localStorage.setItem("userAccuracy", newAccuracy.toString());
}
