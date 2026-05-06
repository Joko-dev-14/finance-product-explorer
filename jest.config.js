const nextJest = require("next/jest");

// nextJest reads your next.config.mjs and .env files automatically,
// and pre-configures transforms for JSX, TypeScript, and CSS modules.
const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // CSS Modules have been removed in favour of Tailwind utility classes.
    // This mapper stubs any remaining *.module.css imports to an empty object
    // so tests don't break if a module import is left behind.
    "\\.module\\.css$": "<rootDir>/__mocks__/styleMock.js",
  },
});
