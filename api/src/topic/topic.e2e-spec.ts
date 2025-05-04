import {
  cleanupE2ESetup,
  cleanupExampleTopics,
  cleanupExampleUsers,
  loginDefaultUser,
  registerAndConnect,
  SetupE2e,
  setupE2ETest,
} from '@tests/e2e-setup';
import { slugify } from '@common/helpers/slugify';

const testTopicDto = {
  title: 'The Philosophy of Stoicism e2example',
  description:
    'An exploration of ancient Stoic principles and their modern relevance.',
  tags: ['philosophy', 'stoicism', 'ethics'],
};

const testTopicUpdateDto = {
  title: 'The magic of life e2example',
  description: 'An exploration of hearth life and beauty of the world.',
  tags: ['life', 'beauty', 'world'],
};

describe('Topics (e2e)', () => {
  let setup: SetupE2e;

  beforeAll(async () => {
    setup = await setupE2ETest();
  });

  afterAll(async () => {
    await cleanupE2ESetup(setup);
  });

  beforeEach(async () => {
    await loginDefaultUser(setup);
  });

  afterEach(async () => {
    await cleanupExampleTopics(setup.prisma);
    await cleanupExampleUsers(setup.prisma);
  });

  describe('POST /topics (create)', () => {
    it('should create a new topic', async () => {
      const response = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      expect(response.body.message).toContain('Topic');
      expect(response.body.message).toContain('created successfully');
      expect(response.body.data.title).toEqual(testTopicDto.title);
      expect(response.body.data.slug).toEqual(slugify(testTopicDto.title));
    });

    it('should conflict on title topic', async () => {
      await setup.agent.post('/topics').send(testTopicDto).expect(201);
      await setup.agent.post('/topics').send(testTopicDto).expect(409);
    });
  });

  describe('GET /topics (findAll)', () => {
    it('should return all topics', async () => {
      await setup.agent.post('/topics').send(testTopicDto).expect(201);

      const response = await setup.agent.get('/topics').expect(200);

      expect(response.body.message).toEqual('List of topics');
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].title).toBeDefined();
    });
  });

  describe('GET /topics/:id (findOne)', () => {
    it('should return a topic by ID', async () => {
      const createResponse = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      const topicId = createResponse.body.data.id;

      const response = await setup.agent.get(`/topics/${topicId}`).expect(200);

      expect(response.body.message).toEqual('Topic found');
      expect(response.body.data.title).toEqual(testTopicDto.title);
    });

    it('should return 404 for non-existing topic', async () => {
      await setup.agent.get('/topics/invalid-id').expect(404);
    });
  });

  describe('PATCH /topics/:id (update)', () => {
    it('should update a topic', async () => {
      const createResponse = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      const topicId = createResponse.body.data.id;

      const response = await setup.agent
        .patch(`/topics/${topicId}`)
        .send(testTopicUpdateDto)
        .expect(200);

      expect(response.body.message).toContain('Topic');
      expect(response.body.message).toContain('updated successfully');
      expect(response.body.data.title).toEqual(testTopicUpdateDto.title);
    });

    it('should return 404 for non-existing topic', async () => {
      await setup.agent.patch('/topics/invalid-id').expect(404);
    });

    it('should return 403 for unauthorized user', async () => {
      const createResponse = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      const topicId = createResponse.body.data.id;

      // Switch to a different user
      await registerAndConnect(setup, {
        username: 'unauthorizedUser',
        email: 'unauthorizedUser@e2example.com',
        password: 'password',
      });

      await setup.agent
        .patch(`/topics/${topicId}`)
        .send(testTopicUpdateDto)
        .expect(403);
    });
  });

  describe('DELETE /topics/:id (delete)', () => {
    it('should delete a topic', async () => {
      const createResponse = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      const topicId = createResponse.body.data.id;

      const response = await setup.agent
        .delete(`/topics/${topicId}`)
        .expect(200);

      expect(response.body.message).toContain('Topic');
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should return 404 for non-existing topic', async () => {
      await setup.agent.delete('/topics/invalid-id').expect(404);
    });

    it('should return 403 for unauthorized user', async () => {
      const createResponse = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      const topicId = createResponse.body.data.id;

      // Switch to a different user
      await registerAndConnect(setup, {
        username: 'unauthorizedUser',
        email: 'unauthorizedUser@e2example.com',
        password: 'password',
      });

      await setup.agent.delete(`/topics/${topicId}`).expect(403);
    });
  });
});
