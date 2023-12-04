import fs from "fs";

const data = fs
  .readFileSync(__dirname + "/data.txt")
  .toString()
  .split("\n");

const stringToNumberMap = [
  { s: "one", d: "one1one" },
  { s: "two", d: "two2two" },
  { s: "three", d: "three3three" },
  { s: "four", d: "four4four" },
  { s: "five", d: "five5five" },
  { s: "six", d: "six6six" },
  { s: "seven", d: "seven7seven" },
  { s: "eight", d: "eight8eight" },
  { s: "nine", d: "nine9nine" },
];

const correctReplaceNumberStrings = (original: string): string => {
  let withReplacements = original;

  stringToNumberMap.forEach((v) => {
    withReplacements = withReplacements.replaceAll(v.s, v.d);
  });

  return withReplacements;
};

//This is wrong because they want to include _any_ valid number string, including overlaps
//In other words, eightwothree represents 823, _not_ 8wo3
const replaceNextNumberString = (original: string): string => {
  const nextStringNumberInstance = stringToNumberMap
    .map((number) => {
      return {
        ...number,
        firstIndex: original.indexOf(number.s),
      };
    })
    .reduce(
      (currentFirst, currentEl) => {
        if (currentFirst.firstIndex === -1) {
          return currentEl;
        } else if (currentEl.firstIndex === -1) {
          return currentFirst;
        } else if (currentEl.firstIndex < currentFirst.firstIndex) {
          return currentEl;
        } else {
          return currentFirst;
        }
      },
      { firstIndex: -1, s: "", d: "" }
    );

  return nextStringNumberInstance.firstIndex > -1
    ? original.replace(nextStringNumberInstance.s, nextStringNumberInstance.d)
    : original;
};

const replaceNumberStrings = (el: string): string => {
  const withReplacements = replaceNextNumberString(el);

  return withReplacements === el
    ? withReplacements
    : replaceNumberStrings(withReplacements);
};

const getCalibrationValue = (el: string): number => {
  const numbers = el.split("").filter((char) => !Number.isNaN(parseInt(char)));
  const calibrationAsString = numbers[0] + numbers[numbers.length - 1];

  return parseInt(calibrationAsString);
};

const resOne = data
  .map(getCalibrationValue)
  .reduce((acc, curr) => acc + curr, 0);
const resTwo = data
  .map(correctReplaceNumberStrings)
  .map(getCalibrationValue)
  .reduce((acc, curr) => acc + curr, 0);

console.log(resTwo);
