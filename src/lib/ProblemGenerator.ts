export class ProblemSet {
  entries: number[];
  result: number;

  constructor(entries: number[], result: number) {
    this.entries = entries;
    this.result = result;
  }
}

export class ProblemGenerator {
  constructor() {}

  generateNumber(
    digits: number,
    allowNegative: boolean,
    furthestNegativeAllowed: number = -Infinity,
  ): number {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;

    let num = Math.floor(Math.random() * (max - min + 1)) + min;

    if (allowNegative) {
      const negativeLimit = Math.max(-max, furthestNegativeAllowed);

      if (Math.random() < 0.5 && num <= -negativeLimit) {
        num *= -1;
      }
    }

    return num;
  }

  addSubtract(numbers: number, digits: number): ProblemSet {
    if (numbers <= 0 || digits <= 0) {
      throw new Error("Numbers and digits must be greater than zero.");
    }

    let result: number[] = [];
    let runningSum = 0;

    for (let i = 0; i < numbers; i++) {
      let furthestNegativeAllowed = -runningSum;
      let num = this.generateNumber(digits, true, furthestNegativeAllowed);

      runningSum += num;
      result.push(num);
    }

    return new ProblemSet(result, runningSum);
  }

  multiply(digits1: number, digits2: number): ProblemSet {
    if (digits1 <= 0 || digits2 <= 0) {
      throw new Error("Digit values must be greater than zero.");
    }

    const num1 = this.generateNumber(digits1, false);
    const num2 = this.generateNumber(digits2, false);

    return new ProblemSet([num1, num2], num1 * num2);
  }

  divide(digits1: number, digits2: number): ProblemSet {
    if (digits1 <= 0 || digits2 <= 0) {
      throw new Error("Digit values must be greater than zero.");
    }

    let divisor = this.generateNumber(digits2, false);
    if (divisor === 0) divisor = 1;

    let dividend = divisor * this.generateNumber(digits1, false);

    return new ProblemSet([dividend, divisor], dividend / divisor);
  }
}
