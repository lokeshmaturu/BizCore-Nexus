/**
 * Central API Route Aggregator
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const salesRoutes = require('./salesRoutes');
const hrRoutes = require('./hrRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const procurementRoutes = require('./procurementRoutes');
const logisticsRoutes = require('./logisticsRoutes');
const financeRoutes = require('./financeRoutes');
const aiRoutes = require('./aiRoutes');
const notificationRoutes = require('./notificationRoutes');
const { getIsConnected } = require('../config/db');
const { ApiResponse } = require('../utils/ApiResponse');

// Health check endpoint
router.get('/health', (req, res) => {
  return ApiResponse.success(res, 'BizCore Nexus API is fully operational', {
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbConnected: getIsConnected(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0',
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/sales', salesRoutes);
router.use('/hr', hrRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/procurement', procurementRoutes);
router.use('/logistics', logisticsRoutes);
router.use('/finance', financeRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
