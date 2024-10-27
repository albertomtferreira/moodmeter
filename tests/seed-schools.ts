// tests/seed-schools.ts
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

type SchoolWithSettings = Prisma.SchoolGetPayload<{
  include: { settings: true }
}>;

async function seedSchools() {
  try {
    console.log('🏫 Starting school seeding...\n');

    const schools = [
      {
        name: 'Grazebrook Primary School',
        code: '100258',
        color: '#4CAF50', // Green
      },
      {
        name: 'Shacklewell Primary School',
        code: '100241',
        color: '#2196F3', // Blue
      },
      {
        name: 'Woodberry Down Primary School',
        code: '100248',
        color: '#FFC107', // Amber
      },
      {
        name: 'Thomas Fairchild Primary School',
        code: '100243',
        color: '#9C27B0', // Purple
      }
    ];

    console.log('Creating schools...');

    for (const school of schools) {
      try {
        // First check if school exists
        const existingSchool = await prisma.school.findUnique({
          where: { code: school.code },
        });

        if (existingSchool) {
          console.log(`⚠️ School with code ${school.code} already exists, skipping...`);
          continue;
        }

        // Create new school
        const createdSchool = await prisma.school.create({
          data: {
            name: school.name,
            code: school.code,
            color: school.color,
            isActive: true,
            settings: {
              create: {
                allowAnonymous: true,
                feedbackEnabled: true,
                requireLocation: false,
                customPeriods: ['MORNING', 'LUNCH', 'AFTERNOON'],
              }
            }
          },
          include: {
            settings: true
          }
        });
        console.log(`✅ Created ${createdSchool.name}`);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.log(`⚠️ School with code ${school.code} already exists, skipping...`);
          } else {
            console.error(`❌ Error creating school ${school.name}:`, error);
          }
        }
      }
    }

    // Verify schools were created
    const schoolCount = await prisma.school.count();
    console.log(`\n🎉 Total schools in database: ${schoolCount}`);

    // List all schools
    const createdSchools = await prisma.school.findMany({
      include: {
        settings: true
      }
    });

    console.log('\nCreated Schools:');
    createdSchools.forEach((school: SchoolWithSettings) => {
      console.log(`
    Name: ${school.name}
    Code: ${school.code}
    Color: ${school.color}
    Active: ${school.isActive}
    ID: ${school.id}
    -------------------`);
    });

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSchools()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });