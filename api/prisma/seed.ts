import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a User
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: 'hashedpassword', // put hashed password
      username: 'DemoUser',
    },
  });

  // Create a Topic
  const topic = await prisma.topic.create({
    data: {
      slug: 'artificial-intelligence',
      title: 'Artificial Intelligence',
      description: 'Discussions and contributions around AI.',
      createdById: user.id,
    },
  });

  // Create a Thread
  const thread = await prisma.thread.create({
    data: {
      title: 'The Future of AI',
      starterMessage: 'Where do you think AI will be in 10 years?',
      createdById: user.id,
      topicId: topic.id,
    },
  });

  // Create a Contribution (starter message automatically created)
  await prisma.contribution.create({
    data: {
      content: 'AI will be integrated in every aspect of our life.',
      threadId: thread.id,
      createdById: user.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
