import { readFile } from "../utils/helpers";

const testData = readFile(__dirname, "test-data.txt");
const data = readFile(__dirname, "data.txt");

class Scratchcard {
  winningNumbers: number[];
  numbers: number[];
  cardNumber: number;

  constructor(input: string, cardNumber: number) {
    const { winningNumbers, numbers } = Scratchcard.parseInput(input);

    this.cardNumber = cardNumber;
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
  }

  getPresentWinningNumbers = (): number[] => {
    return this.numbers.filter((n) => this.winningNumbers.includes(n));
  };

  getTotalScore = (): number => {
    const presentWinningNumbers = this.getPresentWinningNumbers();

    return presentWinningNumbers.reduce((acc) => {
      return !acc ? 1 : acc * 2;
    }, 0);
  };

  static parseInput(input: string) {
    const [winningNumberString, numberString] = input
      .split(":")[1]
      .trim()
      .split("|");

    const winningNumbers = winningNumberString
      .trim()
      .split(" ")
      .map((n) => parseInt(n));
    const numbers = numberString
      .trim()
      .split(" ")
      //Some values are separated by two spaces, filter those resulting empty values out
      .filter((s) => s)
      .map((n) => parseInt(n));

    return { winningNumbers, numbers };
  }
}

class ScratchcardGame {
  scratchcards: Scratchcard[];

  constructor(input: string) {
    this.scratchcards = input
      .split("\n")
      .map((d, i) => new Scratchcard(d, i + 1));
  }

  processCard = (card: Scratchcard): void => {
    const cardsToAdd = card.getPresentWinningNumbers().length;

    new Array(cardsToAdd).fill(null).forEach((_, i) => {
      this.duplicateCard(card.cardNumber + i + 1);
    });
  };

  processCards = (): this => {
    for (let i = 0; i < this.scratchcards.length; i++) {
      this.processCard(this.scratchcards[i]);
    }

    return this;
  };

  duplicateCard = (cardNumber: number): void => {
    this.scratchcards.push(this.scratchcards[cardNumber - 1]);
  };
}

//Part 1
const totalPoints = data
  .split("\n")
  .map((d, i) => new Scratchcard(d, i + 1).getTotalScore())
  .reduce((acc, curr) => acc + curr, 0);

//Part 2
const totalResultingScratchcards = new ScratchcardGame(data).processCards()
  .scratchcards.length;
console.log(totalResultingScratchcards);
