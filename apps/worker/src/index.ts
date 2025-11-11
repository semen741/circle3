import 'dotenv/config';
import { Worker, QueueEvents, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!);
const queueName = process.env.QUEUE_NAME || 'video:process';

const queueEvents = new QueueEvents(queueName, { connection });
queueEvents.on('failed', ({ jobId, failedReason }) => console.error(`[worker] failed ${jobId}: ${failedReason}`));
queueEvents.on('completed', ({ jobId }) => console.log(`[worker] completed ${jobId}`));

function stageProgress(job: Job, stage: string, pct: number) {
  job.updateData({ ...(job.data as any), stage });
  return job.updateProgress({ pct });
}

const worker = new Worker(queueName, async (job) => {
  console.log(`[worker] got job ${job.id}`);
  await stageProgress(job, 'queued', 0);
  // Здесь позже: downloading → trimming → effects → encoding → uploading
  await stageProgress(job, 'done', 100);
  return { ok: true };
}, { connection, concurrency: Number(process.env.QUEUE_CONCURRENCY || 2) });

worker.on('error', (err) => console.error('[worker] error', err));
