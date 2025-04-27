import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';

describe('Topics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/topics (POST)', async () => {
    const token = 'YOUR_VALID_JWT'; // replace with your test auth
    const res = await request(app.getHttpServer())
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'First Test Topic',
        description: 'This is a test topic.',
        tags: ['testing', 'e2e'],
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toEqual('First Test Topic');
  });

  afterAll(async () => {
    await app.close();
  });
});
