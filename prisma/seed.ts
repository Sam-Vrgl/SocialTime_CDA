import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  await db.utilisateur.create({
    data: {
      pseudo_utilisateur: 'demo',
      nom_utilisateur: 'Demo',
      prenom_utilisateur: 'User',
      email_utilisateur: 'demo@example.com',
      mdp_hash: '$2b$10$abcdefghijklmnopqrstuv', // dummy
    },
  });
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
