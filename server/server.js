/**
 * BizCore Nexus – Backend API Server Entry Point
 * Enterprise SaaS Architecture
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { httpLogger } = require('./utils/logger');
const { globalLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS Configuration (Supports credentials & cookies)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Whitelist check
    const allowedOrigins = [
      CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed by BizCore Nexus.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));

// 3. Body & Cookie Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. HTTP Request Logging
app.use(httpLogger);

// 5. Global Rate Limiter
app.use('/api', globalLimiter);

// 6. Root Route & Information
app.get('/', (req, res) => {
  res.json({
    name: 'BizCore Nexus Enterprise API',
    version: '1.0.0',
    description: 'AI-Powered Business Operating System for Distribution & Wholesale Enterprises',
    documentation: '/api/health',
    status: 'OPERATIONAL',
  });
});

// 7. Mount Centralized API Routes
app.use('/api', apiRoutes);

// 8. 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

// 9. Initialize Database & Start Listening
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
============================================================
🚀 BizCore Nexus API Server is Running!
📡 Port:           ${PORT}
🌍 Environment:    ${process.env.NODE_ENV || 'development'}
🔗 Local URL:      http://localhost:${PORT}
🩺 Health Check:   http://localhost:${PORT}/api/health
💻 Client Origin:  ${CLIENT_URL}
============================================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
