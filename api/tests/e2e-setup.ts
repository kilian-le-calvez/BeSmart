// test/utils/e2e-setup.ts
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { PrismaService } from '@prisma-api/prisma.service';
import { INestApplication } from '@nestjs/common';

export const testUser = {
  username: 'user-e2example',
  email: 'user@e2example.com',
  password: 'password123',
};

export async function cleanupExampleUsers(prisma: PrismaService) {
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@e2example.com' },
    },
  });
}

export async function cleanupExampleTopics(prisma) {
  await prisma.topic.deleteMany({
    where: {
      title: { endsWith: 'e2example' },
    },
  });
}

export interface SetupE2e {
  app: INestApplication;
  prisma: PrismaService;
  agent: request.SuperAgentTest;
  token: string;
  testUser: typeof testUser;
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
  await agent.post('/auth/register').send(testUser).expect(201);

  const loginResponse = await agent
    .post('/auth/login')
    .send(testUser)
    .expect(200);

  const token = loginResponse.body.jwt;
  agent.set('Authorization', `Bearer ${token}`);

  return { app, prisma, agent, token, testUser };
}

export async function cleanupE2ESetup(setup: SetupE2e) {
  await cleanupExampleUsers(setup.prisma);
  await cleanupExampleTopics(setup.prisma);
  await setup.app.close();
}
