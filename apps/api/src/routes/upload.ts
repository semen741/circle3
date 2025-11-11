import { FastifyInstance } from 'fastify';
export async function registerUploadRoute(app: FastifyInstance) {
  app.post('/upload', async (_req, reply) => {
    return reply.code(501).send({ error: 'Not implemented in step 1' });
  });
}
