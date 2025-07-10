import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const db = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';

async function main() {
  const admins = [
    {
      username: 'admin1',
      lastName: 'Admin',
      firstName: 'One',
      email: 'admin1@example.com',
      role: Role.ADMIN,
    },
    {
      username: 'admin2',
      lastName: 'Admin',
      firstName: 'Two',
      email: 'admin2@example.com',
      role: Role.ADMIN,
    },
  ];

  const users = Array.from({ length: 8 }, (_, i) => ({
    username: `user${i + 1}`,
    lastName: `User${i + 1}`,
    firstName: ['One','Two','Three','Four','Five','Six','Seven','Eight'][i],
    email: `user${i + 1}@example.com`,
    role: Role.USER,
  }));

  const allAccounts = [...admins, ...users];

  for (const acct of allAccounts) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    await db.user.create({
      data: {
        ...acct,
        passwordHash,
      },
    });
    console.log(`Created ${acct.username} (${acct.role})`);
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
