import { cleanupE2ESetup, SetupE2e, setupE2ETest } from '@tests/e2e-setup';
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
    cleanupE2ESetup(setup);
  });

  describe('POST /topics (create)', () => {
    it('should create a new topic', async () => {
      const response = await setup.agent
        .post('/topics')
        .send(testTopicDto)
        .expect(201);

      expect(response.body.message).toEqual('Topic created successfully');
      expect(response.body.data.title).toEqual(testTopicDto.title);
      expect(response.body.data.slug).toEqual(slugify(testTopicDto.title));
    });

    it('should conflict on title topic', async () => {
      await setup.agent.post('/topics').send(testTopicDto).expect(409);
    });
  });
});
