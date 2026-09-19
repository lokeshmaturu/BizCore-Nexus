/**
 * Operational Telemetry & AI Forecasting Routes
 */

const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getAIForecast,
} = require('../controllers/analyticsController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/ai-forecast', getAIForecast);

module.exports = router;
