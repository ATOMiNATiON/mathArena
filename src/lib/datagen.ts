export function generateTestData(year: number, month: number) {
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let pointsData: Record<number, number> = {};
  let accuracyData: Record<number, number> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    pointsData[day] = Math.floor(Math.random() * 101); // Random points from 0 to 100
    accuracyData[day] = Math.floor(Math.random() * (95 - 5 + 1)) + 5; // Random accuracies from 5 to 95%
  }

  return { pointsData, accuracyData };
}
