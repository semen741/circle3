import { FastifyInstance } from 'fastify';
import { videoQueue } from '../queue.js';

export async function registerJobsRoute(app: FastifyInstance) {
  app.get('/jobs/:id', async (req, reply) => {
    const id = (req.params as any).id;
    const job = await videoQueue.getJob(id);
    if (!job) return reply.code(404).send({ error: 'not found' });
    const progress = typeof job.progress === 'number' ? job.progress : (job.progress as any)?.pct ?? 0;
    return reply.send({ job_id: job.id, status: await job.getState(), stage: (job.data as any)?.stage || 'queued', progress, error: null });
  });
}
