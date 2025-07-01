import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const db = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';

async function main() {
  const admins = [
    {
      pseudo_utilisateur: 'admin1',
      nom_utilisateur: 'Admin',
      prenom_utilisateur: 'One',
      email_utilisateur: 'admin1@example.com',
      role_utilisateur: Role.ADMIN,
    },
    {
      pseudo_utilisateur: 'admin2',
      nom_utilisateur: 'Admin',
      prenom_utilisateur: 'Two',
      email_utilisateur: 'admin2@example.com',
      role_utilisateur: Role.ADMIN,
    },
  ];

  const users = Array.from({ length: 8 }, (_, i) => ({
    pseudo_utilisateur: `user${i + 1}`,
    nom_utilisateur: `User${i + 1}`,
    prenom_utilisateur: `${['One','Two','Three','Four','Five','Six','Seven','Eight'][i]}`,
    email_utilisateur: `user${i + 1}@example.com`,
    role_utilisateur: Role.USER,
  }));

  const all = [...admins, ...users];

  for (const u of all) {
    const mdp_hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    await db.utilisateur.create({
      data: {
        ...u,
        mdp_hash,
      },
    });
    console.log(`Created ${u.pseudo_utilisateur} (${u.role_utilisateur})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
