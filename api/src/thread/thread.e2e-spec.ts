import { HttpStatus } from '@nestjs/common';
import {
  cleanupE2ESetup,
  cleanupExampleUsers,
  cleanupExampleTopics,
  loginDefaultUser,
  registerAndConnect,
  SetupE2e,
  setupE2ETest,
} from '@tests/e2e-setup';

const ZERO_LEN = 0;

const testThreadDto = {
  title: 'What is Stoicism in 2025?',
  content: 'Let us discuss the applications of Stoicism in modern life.',
};

const testThreadUpdateDto = {
  title: 'Revised Stoicism Thread',
  content: 'Updated exploration of Stoicism’s relevance today.',
};

describe('Threads (e2e)', () => {
  let setup: SetupE2e;
  let topicId: string;

  beforeAll(async () => {
    setup = await setupE2ETest();
  });

  afterAll(async () => {
    await cleanupE2ESetup(setup);
  });

  beforeEach(async () => {
    await loginDefaultUser(setup);

    const topic = await setup.agent.post('/topics').send({
      title: 'Stoicism Root Topic',
      description: 'Root topic for all Stoicism-related threads',
      tags: ['philosophy', 'stoicism'],
    });
    topicId = topic.body.data.id;
  });

  afterEach(async () => {
    await cleanupExampleTopics(setup.prisma);
    await cleanupExampleUsers(setup.prisma);
  });

  describe('POST /threads (create)', () => {
    it('should create a thread under a topic', async () => {
      const response = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      expect(response.body.message).toContain('Thread created successfully');
      expect(response.body.data.title).toEqual(testThreadDto.title);
    });
  });

  describe('GET /threads/by-topic/:topicId', () => {
    it('should return threads for a topic', async () => {
      await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const response = await setup.agent
        .get(`/threads/by-topic/${topicId}`)
        .expect(200);

      expect(response.body.message).toEqual('Threads found');
      expect(response.body.data.length).toBeGreaterThan(ZERO_LEN);
      expect(response.body.data[ZERO_LEN].title).toEqual(testThreadDto.title);
    });
  });

  describe('GET /threads/:id (findOne)', () => {
    it('should return a thread by ID', async () => {
      const createResponse = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const threadId = createResponse.body.data.id;

      const response = await setup.agent
        .get(`/threads/${threadId}`)
        .expect(200);

      expect(response.body.message).toEqual('Thread found');
      expect(response.body.data.title).toEqual(testThreadDto.title);
    });

    it('should return 404 for non-existing thread', async () => {
      await setup.agent
        .get('/threads/nonexistent-id')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /threads/:id (update)', () => {
    it('should update a thread', async () => {
      const createResponse = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const threadId = createResponse.body.data.id;

      const response = await setup.agent
        .patch(`/threads/${threadId}`)
        .send(testThreadUpdateDto)
        .expect(200);

      expect(response.body.message).toContain('Thread updated successfully');
      expect(response.body.data.title).toEqual(testThreadUpdateDto.title);
    });

    it('should return 403 for unauthorized user', async () => {
      const createResponse = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const threadId = createResponse.body.data.id;

      await registerAndConnect(setup, {
        username: 'otherUser',
        email: 'otherUser@e2example.com',
        password: 'password',
      });

      await setup.agent
        .patch(`/threads/${threadId}`)
        .send(testThreadUpdateDto)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return 404 for non-existing thread', async () => {
      await setup.agent.patch('/threads/fake-id').expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /threads/:id (delete)', () => {
    it('should delete a thread', async () => {
      const createResponse = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const threadId = createResponse.body.data.id;

      const response = await setup.agent
        .delete(`/threads/${threadId}`)
        .expect(200);

      expect(response.body.message).toContain('Thread deleted successfully');
    });

    it('should return 403 for unauthorized user', async () => {
      const createResponse = await setup.agent
        .post('/threads')
        .send({ ...testThreadDto, topicId })
        .expect(201);

      const threadId = createResponse.body.data.id;

      await registerAndConnect(setup, {
        username: 'thirdUser',
        email: 'thirdUser@e2example.com',
        password: 'password',
      });

      await setup.agent
        .delete(`/threads/${threadId}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return 404 for non-existing thread', async () => {
      await setup.agent
        .delete('/threads/invalid-id')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
