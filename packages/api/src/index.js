import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';
import { triageRoutes } from './routes/triage.js';
import { dashboardRoutes } from './routes/dashboard.js';

config();

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

// Routes
await app.register(triageRoutes, { prefix: '/api/triage' });
await app.register(dashboardRoutes, { prefix: '/api/dashboard' });

// Health check
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port, host });
  console.log(`🏥 Health Triage API running on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
