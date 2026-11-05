import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { fetchRealtimeLocationNews } from './src/services/newsCollector.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const hostArgIndex = process.argv.indexOf('--host');
const cliHost = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : '0.0.0.0';

// AI Studio requires the dev server to run on port 3000. Avoid 8080 container proxy collision.
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null;
const PORT = cliPort || (envPort && envPort !== 8080 ? envPort : 3000);
const HOST = cliHost || '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API: Real-time News Collection from World, India, and Kerala platforms
app.get('/api/news/live', async (req: Request, res: Response) => {
  try {
    const location = (req.query.location as string) || 'Thrissur, Kerala';
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
    const maxCount = req.query.maxCount ? parseInt(req.query.maxCount as string, 10) : 12;
    const scope = (req.query.scope as 'all' | 'world' | 'india' | 'kerala') || 'all';

    const stories = await fetchRealtimeLocationNews({
      location,
      lat,
      lng,
      maxCount,
      scope,
    });

    res.json({
      success: true,
      location,
      scope,
      count: stories.length,
      timestamp: new Date().toISOString(),
      platforms: ['BBC World', 'Reuters', 'Times of India', 'Mathrubhumi', 'Hindustan Times', 'News 24', 'Al Jazeera'],
      stories,
    });
  } catch (error: any) {
    console.error('Error collecting real-time news:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to collect live news stream',
      stories: [],
    });
  }
});

// API: Image Proxy to reliably deliver exact publisher photos across CDN referrer & CORS locks
app.get('/api/news/image-proxy', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return res.status(400).send('Invalid or missing image url');
  }

  try {
    const parsed = new URL(imageUrl);
    const upstream = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': `${parsed.protocol}//${parsed.hostname}/`,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send(`Failed to proxy image: ${upstream.statusText}`);
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    const arrayBuffer = await upstream.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.warn('[Image Proxy Error]:', err?.message || err);
    res.status(502).send('Error retrieving upstream news image');
  }
});

// API: Monitored Platforms Health & Status
app.get('/api/news/sources', (_req: Request, res: Response) => {
  res.json({
    platforms: [
      {
        id: 'timesofindia',
        name: 'The Times of India',
        shortName: 'TOI',
        status: 'online',
        coverage: 'National & Hyperlocal Cities (Kochi, Thrissur, Bengaluru, Delhi, Mumbai)',
        imageSupport: 'Real Article Enclosure & CDN Thumbnails',
        badgeColor: '#dc2626',
      },
      {
        id: 'mathrubhumi',
        name: 'Mathrubhumi',
        shortName: 'Mathrubhumi',
        status: 'online',
        coverage: 'Kerala Statewide & District Editions (Thrissur, Kochi, Malabar)',
        imageSupport: 'Direct WebP/JPEG Media Thumbnails',
        badgeColor: '#059669',
      },
      {
        id: 'hindustantimes',
        name: 'Hindustan Times',
        shortName: 'Hindustan Times',
        status: 'online',
        coverage: 'National, Metros & Regional Corridors',
        imageSupport: '1600x900 Media Content Hero Thumbnails',
        badgeColor: '#0284c7',
      },
      {
        id: 'news24',
        name: 'News 24',
        shortName: 'News 24',
        status: 'online',
        coverage: 'Breaking 24/7 National & State Civic Feeds',
        imageSupport: 'Real-time Newsfeed Thumbnails',
        badgeColor: '#ea580c',
      },
    ],
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', port: PORT, host: HOST, mode: isProduction ? 'production' : 'development' });
});

async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve pre-built static client assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[ImpactPulse Server] running on http://${HOST}:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer();
