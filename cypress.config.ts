import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    baseUrl: "https://lightgrey-antelope-m7vwozwl8xf7l3y2.builder-preview.com/",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
