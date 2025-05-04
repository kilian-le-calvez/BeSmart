import { cleanupExampleUsers, SetupE2e, setupE2ETest } from '@tests/e2e-setup';

describe('UserController (e2e)', () => {
  let setup: SetupE2e;

  beforeAll(async () => {
    setup = await setupE2ETest();
  });

  afterAll(async () => {
    // Clean up any test data after tests are finished
    cleanupExampleUsers(setup.prisma);
    await setup.app.close();
  });

  it('GET /users/me should return the current user details', async () => {
    // Send the token explicitly in the Authorization header
    const response = await setup.agent.get('/users/me').expect(200);

    // Validate the response
    expect(response.body.email).toBe(setup.testUser.email);
  });

  it('GET /users should return all users', async () => {
    const response = await setup.agent.get('/users').expect(200);

    expect(response.body.length).toBeGreaterThan(0); // Assert there’s at least one user
    expect(response.body[0].id).toBeDefined(); // Check if the username field is present
    expect(response.body[0].email).toBeDefined(); // Check if the email field is present
  });
});
