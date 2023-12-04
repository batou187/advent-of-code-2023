import { readFile } from "../utils/helpers";

const testData = readFile(__dirname, "test-data.txt");
const data = readFile(__dirname, "data.txt");

enum Color {
  Blue = "blue",
  Green = "green",
  Red = "red",
}
type CubeCount = Record<Color, number>;

class Game {
  number: number;
  rounds: CubeCount[];

  constructor(rawStringValue: string, number: number) {
    this.number = number;
    this.rounds = Game.parseRounds(rawStringValue);
  }

  static parseRounds = (rawStringValue: string): CubeCount[] => {
    return rawStringValue
      .split(": ")[1]
      .split(";")
      .map((s) => s.trim())
      .map(Game.parseRound);
  };

  static parseRound = (rawRoundString: string): CubeCount => {
    return rawRoundString
      .split(",")
      .map((s) => s.trim())
      .reduce(
        (prev, curr) => {
          const [count, color] = curr.split(" ") as [string, Color];

          prev[color] = parseInt(count);

          return prev;
        },
        { blue: 0, green: 0, red: 0 }
      );
  };

  isValidForColor(
    countRule: CubeCount,
    round: CubeCount,
    color: Color
  ): boolean {
    if (!round[color]) {
      return true;
    }

    return countRule[color] >= round[color];
  }

  isValidRound = (countRule: CubeCount, round: CubeCount): boolean => {
    return (
      this.isValidForColor(countRule, round, Color.Blue) &&
      this.isValidForColor(countRule, round, Color.Green) &&
      this.isValidForColor(countRule, round, Color.Red)
    );
  };

  isValidGame(countRule: CubeCount): boolean {
    return this.rounds.every((r) => this.isValidRound(countRule, r));
  }

  getMaxCounts = (): CubeCount => {
    return {
      blue: Math.max(...this.rounds.map((r) => r.blue)),
      green: Math.max(...this.rounds.map((r) => r.green)),
      red: Math.max(...this.rounds.map((r) => r.red)),
    };
  };

  getPower = (): number => {
    const { blue, green, red } = this.getMaxCounts();

    return blue * green * red;
  };
}

//Part 1
console.log(
  data
    .split("\n")
    .map((d, i) => new Game(d, i + 1))
    .filter((g) => g.isValidGame({ red: 12, green: 13, blue: 14 }))
    .reduce((acc, curr) => acc + curr.number, 0)
);

//Part 2
console.log(
  data
    .split("\n")
    .map((d, i) => new Game(d, i + 1).getPower())
    .reduce((acc, curr) => acc + curr, 0)
);
