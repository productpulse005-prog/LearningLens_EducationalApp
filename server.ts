import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  analyzeRealWorldObjects,
  analyzeStudentObservation,
  generateBuildFromKnowledge,
  generateInterventionDetails,
} from './src/lib/gemini';

dotenv.config();

/**
 * ============================================================================
 * RATE LIMITING CONFIGURATION (DEMO / PORTFOLIO SAFEGUARD)
 * ============================================================================
 * Protected Endpoints:
 *   - POST /api/analyze
 *   - POST /api/intervention
 *   - POST /api/context
 *   - POST /api/build-from-knowledge
 *
 * Rate Limit:
 *   - Maximum 10 requests collectively across these 4 endpoints per IP address
 *     within a 1-hour rolling window.
 *
 * Purpose:
 *   - Protects Gemini API quota from excessive usage when publicly deployed on
 *     Vercel and shared on LinkedIn or portfolio showcases.
 *
 * Vercel Serverless Architecture Note:
 *   - In serverless environments (like Vercel), in-memory IP tracking is local
 *     to the current function container instance. This lightweight approach
 *     requires no external dependencies or database setup.
 *   - For enterprise production-scale deployments, a distributed store such as
 *     Upstash Redis, Vercel KV, or Cloudflare Rate Limiting should be used.
 * ============================================================================
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const aiRateLimitStore = new Map<string, RateLimitRecord>();
const AI_RATE_LIMIT_MAX = 10; // Max requests per window
const AI_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window in milliseconds

function aiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Extract client IP address (supporting X-Forwarded-For when behind proxy or Vercel)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown-ip';

  const now = Date.now();
  const record = aiRateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    aiRateLimitStore.set(ip, {
      count: 1,
      resetTime: now + AI_RATE_LIMIT_WINDOW_MS,
    });
    return next();
  }

  if (record.count >= AI_RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: "You've reached the demo usage limit. Please try again later.",
    });
  }

  record.count += 1;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Observation Analysis (Protected by Rate Limiter)
  app.post('/api/analyze', aiRateLimiter, async (req, res) => {
    try {
      const result = await analyzeStudentObservation(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/analyze error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // AI Micro-Intervention Generation (Protected by Rate Limiter)
  app.post('/api/intervention', aiRateLimiter, async (req, res) => {
    try {
      const result = await generateInterventionDetails(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/intervention error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Real-World Context Engine (Protected by Rate Limiter)
  app.post('/api/context', aiRateLimiter, async (req, res) => {
    try {
      const result = await analyzeRealWorldObjects(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/context error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Build From What They Know Bridge (Protected by Rate Limiter)
  app.post('/api/build-from-knowledge', aiRateLimiter, async (req, res) => {
    try {
      const result = await generateBuildFromKnowledge(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/build-from-knowledge error:', err?.message || 'Unknown error');
      res.status(500).json({ error: 'Something went wrong while generating the learning insight. Please try again.' });
    }
  });

  // Vite Middleware in Development vs Static File Serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Learning Lens server running on http://localhost:${PORT}`);
  });
}

startServer();
