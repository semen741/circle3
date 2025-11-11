import 'dotenv/config';
import Fastify from 'fastify';
import rateLimit from 'fastify-rate-limit';
import { registerProcessRoute } from './routes/process.js';
import { registerUploadRoute } from './routes/upload.js';
import { registerJobsRoute } from './routes/jobs.js';

const app = Fastify({ logger: true });
await app.register(rateLimit, { max: Number(process.env.API_RATE_LIMIT || 100), timeWindow: '1 minute' });

app.get('/health', async () => ({ ok: true }));
await registerProcessRoute(app);
await registerUploadRoute(app);
await registerJobsRoute(app);

const port = Number(process.env.PORT_API || 8080);
app.listen({ port, host: '0.0.0.0' }).then(() => console.log(`[api] on :${port}`));
