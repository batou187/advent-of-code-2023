import { readFile } from "../utils/helpers";

const testData = readFile(__dirname, "test-data.txt");
const data = readFile(__dirname, "data.txt");

type Number = { value: number; x: number[]; y: number };
type Symbol = { value: string; x: number; y: number };

class Schematic {
  numbers: Number[];
  symbols: Symbol[];

  constructor(input: string) {
    const parsedInput = input.split("\n").map(Schematic.processString);

    this.numbers = parsedInput.flatMap((i) => i.numbers);
    this.symbols = parsedInput.flatMap((i) => i.symbols);
  }

  hasAdjacentSymbol = (number: Number): boolean => {
    return this.symbols.some((s) => {
      const validXValues = [
        number.x[0] - 1,
        ...number.x,
        number.x[number.x.length - 1] + 1,
      ];

      const validYValues = [number.y - 1, number.y, number.y + 1];

      return validXValues.some((x) => {
        return validYValues.some((y) => {
          return s.x === x && s.y === y;
        });
      });
    });
  };

  getPartNumbers = (): Number[] => {
    return this.numbers.filter(this.hasAdjacentSymbol);
  };

  getAdjacentPartNumbers = (symbol: Symbol): Number[] => {
    return this.numbers.filter((n) => {
      const validXValues = [symbol.x - 1, symbol.x, symbol.x + 1];
      const validYValues = [symbol.y - 1, symbol.y, symbol.y + 1];

      return validXValues.some((x) => {
        return validYValues.some((y) => {
          return n.x.includes(x) && n.y === y;
        });
      });
    });
  };

  getGears = (): Symbol[] => {
    return this.symbols.filter((s) => {
      return s.value === "*" && this.getAdjacentPartNumbers(s).length === 2;
    });
  };

  getGearRatio = (symbol: Symbol): number => {
    return this.getAdjacentPartNumbers(symbol).reduce((acc, curr) => {
      return acc * curr.value;
    }, 1);
  };

  getGearRatios = (): number => {
    return this.getGears()
      .map(this.getGearRatio)
      .reduce((acc, curr) => acc + curr, 0);
  };

  static processString = (s: string, y: number) => {
    const asCharArray = s.split("");

    const numbers: Number[] = [];
    const symbols: Symbol[] = [];

    let tempNumber: string[] = [];
    let xIndices: number[] = [];
    let prevWasDigit: boolean = false;

    asCharArray.forEach((el, i, arr) => {
      if ((el === "." || Number.isNaN(parseInt(el))) && prevWasDigit) {
        const newNumber = parseInt(tempNumber.join(""));
        numbers.push({ value: newNumber, x: xIndices, y });

        tempNumber = [];
        xIndices = [];
        prevWasDigit = false;
      }
      if (el === ".") {
        return;
      } else if (Number.isNaN(parseInt(el))) {
        symbols.push({ value: el, x: i, y });
      } else {
        tempNumber.push(el);
        xIndices.push(i);
        prevWasDigit = true;
      }

      if (i === arr.length - 1) {
        const newNumber = parseInt(tempNumber.join(""));
        numbers.push({ value: newNumber, x: xIndices, y });
      }
    });

    return { numbers, symbols };
  };
}

const schematic = new Schematic(data);

//Part 1
const partNumberSum = schematic
  .getPartNumbers()
  .reduce((acc, curr) => acc + curr.value, 0);

//Part 2
const gearRatios = schematic.getGearRatios();
