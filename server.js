const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT         = process.env.PORT         || 3060;
const JWT_SECRET   = process.env.JWT_SECRET   || '2410511070';
const SERVICE1_URL = process.env.SERVICE1_URL || 'http://localhost:3061';
const SERVICE2_URL = process.env.SERVICE2_URL || 'http://localhost:3062';

const PUBLIC_PATHS = ['/api/auth/login', '/health'];

const verifyToken = (req, res, next) => {
  const isPublic = PUBLIC_PATHS.some(p => req.path === p || req.path.startsWith(p));
  if (isPublic) return next();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied, hunter! Please login at POST /api/auth/login.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.headers['x-hunter-id']   = String(decoded.id);
    req.headers['x-hunter-name'] = decoded.name;
    req.headers['x-hunter-rank'] = String(decoded.rank);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Hunter license expired! Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Invalid hunter license! Access forbidden.',
      code: 'INVALID_TOKEN'
    });
  }
};

app.use(verifyToken);

app.use(createProxyMiddleware({
  pathFilter: '/api/auth',
  target: SERVICE1_URL,
  changeOrigin: true,
  on: {
    error: (_err, _req, res) => res.status(503).json({
      status: 'error',
      message: 'Guild Service (auth) unavailable. Make sure service1 is running on port 3061.'
    })
  }
}));

app.use(createProxyMiddleware({
  pathFilter: '/api/guild',
  target: SERVICE1_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/guild': '/api' },
  on: {
    error: (_err, _req, res) => res.status(503).json({
      status: 'error',
      message: 'Guild Service unavailable. Make sure service1 is running on port 3061.'
    })
  }
}));

app.use(createProxyMiddleware({
  pathFilter: '/api/quest',
  target: SERVICE2_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/quest': '/api' },
  on: {
    error: (_err, _req, res) => res.status(503).json({
      status: 'error',
      message: 'Quest Board unavailable. Make sure service2 is running on port 3062.'
    })
  }
}));

app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Kamura Hub API Gateway',
    timestamp: new Date().toISOString(),
    routes: {
      auth:       'POST /api/auth/login | POST /api/auth/logout  → service1 :3061',
      guild:      '/api/guild/*  → service1 :3061',
      questBoard: '/api/quest/*  → service2 :3062'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found in Kamura Hub.`
  });
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('  KAMURA HUB - API GATEWAY');
  console.log('  Monster Hunter Rise: Sunbreak');
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log('╚══════════════════════════════════════════╝\n');
});
