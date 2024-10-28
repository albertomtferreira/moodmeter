// tests/test-db.ts
import { prisma } from '../lib/prisma';

async function main() {
  try {
    console.log('🚀 Starting database tests...\n');

    // 1. Create a test user
    console.log('Creating test user...');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        clerkId: 'test_clerk_id',
        username: 'testuser',
      },
    });
    console.log('✅ User created:', user);

    // 2. Create test schools
    console.log('\nCreating test schools...');
    const schools = await Promise.all([
      prisma.school.create({
        data: {
          name: 'School A',
          code: 'SCH_A',
          color: '#FF5733',
          settings: {
            create: {
              allowAnonymous: true,
              feedbackEnabled: true,
              customPeriods: ['MORNING_BREAK', 'LUNCH'],
            },
          },
        },
      }),
      prisma.school.create({
        data: {
          name: 'School B',
          code: 'SCH_B',
          color: '#33FF57',
          settings: {
            create: {
              allowAnonymous: false,
              feedbackEnabled: true,
              customPeriods: ['LUNCH', 'AFTERNOON_BREAK'],
            },
          },
        },
      }),
    ]);
    console.log('✅ Schools created:', schools);

    // 3. Associate user with schools
    console.log('\nAssociating user with schools...');
    const schoolUsers = await Promise.all([
      prisma.schoolUser.create({
        data: {
          userId: user.id,
          schoolId: schools[0].id,
          role: 'ADMIN',
          isPreferred: true,
        },
      }),
      prisma.schoolUser.create({
        data: {
          userId: user.id,
          schoolId: schools[1].id,
          role: 'VIEWER',
          isPreferred: false,
        },
      }),
    ]);
    console.log('✅ School-User associations created:', schoolUsers);

    // 4. Create user settings
    console.log('\nCreating user settings...');
    const userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        submissionCooldown: 5000,
        defaultPeriod: 'LUNCH',
        defaultLocation: 'CAFETERIA',
        theme: 'LIGHT',
      },
    });
    console.log('✅ User settings created:', userSettings);

    // 5. Create some mood entries
    console.log('\nCreating mood entries...');
    const moods = await Promise.all([
      prisma.mood.create({
        data: {
          type: 'HAPPY',
          schoolId: schools[0].id,
          period: 'LUNCH',
          location: 'CAFETERIA',
        },
      }),
      prisma.mood.create({
        data: {
          type: 'OKAY',
          schoolId: schools[0].id,
          period: 'AFTERNOON',
          location: 'CLASSROOM',
        },
      }),
      prisma.mood.create({
        data: {
          type: 'UNHAPPY',
          schoolId: schools[1].id,
          period: 'MORNING',
          location: 'PLAYGROUND',
        },
      }),
    ]);
    console.log('✅ Mood entries created:', moods);

    // 6. Test queries
    console.log('\nTesting queries...');

    // Get user with schools and settings
    const userWithRelations = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: {
        schools: {
          include: {
            school: true,
          },
        },
        settings: true,
      },
    });
    console.log('✅ User with relations:', userWithRelations);

    // Get school moods with count
    const schoolMoods = await prisma.school.findFirst({
      where: { code: 'SCH_A' },
      include: {
        moods: true,
        _count: {
          select: { moods: true },
        },
      },
    });
    console.log('✅ School moods:', schoolMoods);

    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    // Clean up (optional - comment out if you want to keep the test data)
    console.log('\nCleaning up test data...');
    // await prisma.mood.deleteMany();
    // await prisma.schoolUser.deleteMany();
    // await prisma.userSettings.deleteMany();
    // await prisma.schoolSettings.deleteMany();
    // await prisma.school.deleteMany();
    // await prisma.user.deleteMany();

    // await prisma.$disconnect();
    // console.log('✅ Cleanup completed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });