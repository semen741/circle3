import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { videoQueue } from '../queue.js';

const Body = z.object({
  file_id: z.string().optional(),
  chat_id: z.number(),
  start_time: z.number().min(0),
  end_time: z.number().positive(),
  effects: z.record(z.any()).default({}),
  idempotency_key: z.string().optional()
}).refine(v => !v.file_id || v.end_time > v.start_time, { message: 'end_time must be > start_time' });

export async function registerProcessRoute(app: FastifyInstance) {
  app.post('/process', async (req, reply) => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { file_id, chat_id, start_time, end_time, effects, idempotency_key } = parsed.data;

    const job = await videoQueue.add('process', {
      job_id: crypto.randomUUID(),
      chat_id,
      reply_progress_message_id: null,
      file_id,
      upload_tmp_path: null,
      start_time,
      end_time,
      effects,
      constraints: { max_size_mb: 20 },
      idempotency_key: idempotency_key || undefined
    }, {
      removeOnComplete: { age: 60 * 60 * 24, count: 1000 },
      removeOnFail: { age: 60 * 60 * 24, count: 1000 },
      attempts: Number(process.env.QUEUE_RETRIES || 3),
      backoff: { type: 'exponential', delay: 2000 }
    });

    return reply.code(201).send({ status: 'queued', job_id: job.id, progress_message_id: null });
  });
}
