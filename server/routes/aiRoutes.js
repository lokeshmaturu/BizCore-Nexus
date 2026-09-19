const express = require('express');
const router = express.Router();
const { queryCopilot, getAIRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/copilot', queryCopilot);
router.get('/recommendations', getAIRecommendations);

module.exports = router;
