/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin }  = require ('@badeball/cypress-cucumber-preprocessor/esbuild')
const addBridgeService = require('./cypress/plugins/bridgeService')


module.exports = defineConfig({
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'reports/screenshots',
  videosFolder: 'reports/videos',
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      addCucumberPreprocessorPlugin(on, config)
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // add bridge service
      addBridgeService(on);

      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.feature',
  },
})