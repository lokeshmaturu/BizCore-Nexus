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

// 2. CORS Configuration (Supports credentials & cookies for both local and production)
const allowedOrigins = [
  'https://biz-core-nexus-wp6u.vercel.app',
  'https://biz-core-nexus.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
];

if (process.env.CLIENT_URL) {
  const cleanClientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(cleanClientUrl)) {
    allowedOrigins.push(cleanClientUrl);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Check if origin is explicitly in whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Allow all Vercel deployment and preview URLs (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow all localhost origins
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    callback(new Error(`CORS policy violation: Origin '${origin}' is not authorized by BizCore Nexus API.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
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

// 6. Root Route & Telemetry Information
app.get('/', (req, res) => {
  const acceptsHtml = req.accepts('html');
  if (acceptsHtml && !req.xhr) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BizCore Nexus – API Service</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #070b14;
            color: #f1f5f9;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
          }
          .card {
            background: rgba(17, 24, 39, 0.9);
            border: 1px solid rgba(56, 189, 248, 0.2);
            border-radius: 24px;
            padding: 40px;
            max-width: 540px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
          }
          h1 { font-size: 26px; font-weight: 800; margin-bottom: 8px; color: #ffffff; }
          p { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
          .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }
          .btn-primary {
            background: linear-gradient(135deg, #0c8fe9 0%, #025aa1 100%);
            color: #ffffff;
            box-shadow: 0 10px 20px -5px rgba(12, 143, 233, 0.4);
          }
          .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }
          .btn-secondary {
            background: #1e293b;
            color: #cbd5e1;
            border: 1px solid #334155;
          }
          .btn-secondary:hover { background: #334155; color: #ffffff; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● Backend API Operational</div>
          <h1>BizCore Nexus Server</h1>
          <p>This is the RESTful API microservice powering the BizCore Nexus Enterprise Operating System. Access the live UI application via the Frontend Portal.</p>
          <div class="btn-group">
            <a href="${CLIENT_URL || 'http://localhost:5173'}" class="btn btn-primary">Open Frontend UI Portal →</a>
            <a href="/api/health" class="btn btn-secondary">API Health Telemetry</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    name: 'BizCore Nexus Enterprise API',
    version: '2.0.0',
    description: 'AI-Powered Business Operating System for Distribution & Wholesale Enterprises',
    documentation: '/api/health',
    clientUrl: CLIENT_URL,
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
