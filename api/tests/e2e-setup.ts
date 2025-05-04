// test/utils/e2e-setup.ts
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { PrismaService } from '@prisma-api/prisma.service';
import { INestApplication } from '@nestjs/common';

export const e2eUser = {
  username: 'user-e2edefaultexample',
  email: 'user@e2edefaultexample.com',
  password: 'password123',
};

async function cleanupDefaultUsers(prisma: PrismaService) {
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@e2edefaultexample.com' },
    },
  });
}

export async function cleanupExampleUsers(prisma: PrismaService) {
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@e2example.com' },
    },
  });
}

export async function cleanupExampleTopics(prisma: PrismaService) {
  await prisma.topic.deleteMany({
    where: {
      title: { endsWith: 'e2example' },
    },
  });
}

export async function cleanupE2ESetup(setup: SetupE2e) {
  await cleanupExampleUsers(setup.prisma);
  await cleanupExampleTopics(setup.prisma);
  await cleanupDefaultUsers(setup.prisma);
  await setup.app.close();
}

export interface SetupE2e {
  app: INestApplication;
  prisma: PrismaService;
  agent: request.SuperAgentTest;
  token: string;
  e2eUser: typeof e2eUser;
}

export async function setupE2ETest(): Promise<SetupE2e> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const prisma = moduleFixture.get<PrismaService>(PrismaService);

  await app.init();

  await cleanupExampleUsers(prisma);
  await cleanupExampleTopics(prisma);

  const agent = request.agent(app.getHttpServer());
  // Either register or / and login the default user
  await agent.post('/auth/register').send(e2eUser);
  const loginResponse = await agent.post('/auth/login').send(e2eUser);

  const token = loginResponse.body.jwt;
  agent.set('Authorization', `Bearer ${token}`);

  return { app, prisma, agent, token, e2eUser };
}

export async function registerAndConnect(
  setup: SetupE2e,
  user: typeof e2eUser,
): Promise<request.SuperAgentTest> {
  await setup.agent.post('/auth/register').send(user).expect(201);

  const loginResponse = await setup.agent
    .post('/auth/login')
    .send(user)
    .expect(200);

  const token = loginResponse.body.jwt;
  setup.agent.set('Authorization', `Bearer ${token}`);

  return setup.agent;
}

export async function loginDefaultUser(
  setup: SetupE2e,
): Promise<request.SuperAgentTest> {
  const loginResponse = await setup.agent
    .post('/auth/login')
    .send(e2eUser)
    .expect(200);

  const token = loginResponse.body.jwt;
  setup.agent.set('Authorization', `Bearer ${token}`);

  return setup.agent;
}
