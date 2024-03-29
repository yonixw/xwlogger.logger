import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  testPathIgnorePatterns: ["dist/", "lib/dist/"],
  coveragePathIgnorePatterns: ["dist/", "lib/dist/"],
  collectCoverage: true,
  coverageReporters: ["html"],
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
export default config;
