const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // cacheDirectory: join(__dirname, '.cache', 'puppeteer'), // Custom cache directory (optional)
  chrome: {
    skipDownload: false, // Ensure Chrome is downloaded
  },
};
