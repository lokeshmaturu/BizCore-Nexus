/**
 * Morgan Logger Configuration & Custom Log Formatting
 */

const morgan = require('morgan');

// Custom morgan format for enterprise API tracking
const morganFormat = process.env.NODE_ENV === 'production'
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
  : 'dev';

const httpLogger = morgan(morganFormat);

module.exports = { httpLogger };
