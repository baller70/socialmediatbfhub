
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  console.log('Created test user:', user.email);

  // Create user preferences
  await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      theme: 'light',
      layout: 'single',
      sidebarWidth: 240,
      autoRefresh: false,
      refreshInterval: 300,
      notifications: true,
      keyboardShortcuts: true,
    },
  });

  // Create sample apps
  const sampleApps = [
    {
      name: 'Google',
      url: 'https://google.com',
      icon: '🔍',
      category: 'Search',
      description: 'Google Search Engine',
      position: 1,
      isFavorite: true,
    },
    {
      name: 'Gmail',
      url: 'https://mail.google.com',
      icon: '📧',
      category: 'Communication',
      description: 'Google Mail Service',
      position: 2,
      isFavorite: true,
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: '⚡',
      category: 'Work',
      description: 'Code Repository Platform',
      position: 3,
      isFavorite: false,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: '🎥',
      category: 'Entertainment',
      description: 'Video Streaming Platform',
      position: 4,
      isFavorite: false,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: '💼',
      category: 'Social Media',
      description: 'Professional Network',
      position: 5,
      isFavorite: false,
    },
    {
      name: 'Notion',
      url: 'https://notion.so',
      icon: '📝',
      category: 'Productivity',
      description: 'All-in-one workspace',
      position: 6,
      isFavorite: true,
    },
  ];

  for (const appData of sampleApps) {
    const existingApp = await prisma.app.findFirst({
      where: {
        userId: user.id,
        name: appData.name
      }
    });

    if (!existingApp) {
      await prisma.app.create({
        data: {
          ...appData,
          userId: user.id,
        },
      });
    }
  }

  console.log('Created sample apps');

  // Create sample bookmarks
  const apps = await prisma.app.findMany({
    where: { userId: user.id },
  });

  const sampleBookmarks = [
    {
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React docs',
      appId: apps.find(app => app.name === 'GitHub')?.id || apps[0].id,
    },
    {
      title: 'TypeScript Handbook',
      url: 'https://typescriptlang.org/docs',
      description: 'TypeScript documentation',
      appId: apps.find(app => app.name === 'GitHub')?.id || apps[0].id,
    },
    {
      title: 'Inbox',
      url: 'https://mail.google.com/mail/u/0/#inbox',
      description: 'Gmail Inbox',
      appId: apps.find(app => app.name === 'Gmail')?.id || apps[0].id,
    },
  ];

  for (const bookmarkData of sampleBookmarks) {
    await prisma.bookmark.create({
      data: {
        ...bookmarkData,
        userId: user.id,
      },
    });
  }

  console.log('Created sample bookmarks');

  // Create sample analytics data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);

    for (const app of apps.slice(0, 4)) {
      const sessionCount = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < sessionCount; j++) {
        const sessionStart = new Date(date);
        sessionStart.setHours(Math.floor(Math.random() * 16) + 8); // 8 AM to 11 PM
        sessionStart.setMinutes(Math.floor(Math.random() * 60));
        
        const duration = Math.floor(Math.random() * 3600) + 300; // 5 min to 1 hour
        const sessionEnd = new Date(sessionStart.getTime() + duration * 1000);
        
        await prisma.analytics.create({
          data: {
            userId: user.id,
            appId: app.id,
            sessionStart,
            sessionEnd,
            duration,
            clickCount: Math.floor(Math.random() * 50) + 1,
            date: date,
          },
        });
      }
    }
  }

  console.log('Created sample analytics data');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
