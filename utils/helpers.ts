import fs from "fs";

export const readFile = (dirname: string, filename: string): string => {
  return fs.readFileSync(dirname + "/" + filename).toString();
};
