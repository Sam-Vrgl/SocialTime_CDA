import { PrismaClient, Role, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcrypt';
import { MongoClient, GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const MONGO_DB = process.env.MONGO_DB || 'social_demo_mongo';
const IMAGES_DIR = path.join(__dirname, '..', 'images'); // adjust if needed

async function main() {
  // 0. Clear existing data (optional, to avoid duplicates)
  await db.post.deleteMany();
  await db.user.deleteMany();

  // 1. Connect to MongoDB and prepare GridFS bucket
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const mongoDb = mongoClient.db(MONGO_DB);
  const bucket = new GridFSBucket(mongoDb, { bucketName: 'postImages' });

  // 2. Seed Admins and Users
  const admins = [
    { username: 'admin1', firstName: 'One', lastName: 'Admin', email: 'admin1@example.com', role: Role.ADMIN },
    { username: 'admin2', firstName: 'Two', lastName: 'Admin', email: 'admin2@example.com', role: Role.ADMIN },
  ];
  const users = Array.from({ length: 8 }, (_, i) => ({
    username: `user${i + 1}`,
    firstName: ['One','Two','Three','Four','Five','Six','Seven','Eight'][i],
    lastName: `User${i + 1}`,
    email: `user${i + 1}@example.com`,    
    role: Role.USER,
  }));

  const allAccounts = [...admins, ...users];
  const createdUsers: PrismaUser[] = [];

  for (const acct of allAccounts) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    const user = await db.user.create({ data: { ...acct, passwordHash } });
    createdUsers.push(user);
    console.log(`Created ${acct.username} (${acct.role})`);
  }

  // 3. Seed 12 Posts with Images
  const authorPool = [
    createdUsers.find(u => u.username === 'admin1')!.id,
    createdUsers.find(u => u.username === 'user1')!.id,
  ];

  const postDefs = Array.from({ length: 12 }, (_, idx) => ({
    imagePath: path.join(IMAGES_DIR, `${idx + 1}.jpg`),
    description: `This is post #${idx + 1}`,
    authorId: authorPool[idx % authorPool.length],
  }));

  for (const { imagePath, description, authorId } of postDefs) {
    // Upload image file into GridFS
    const filename = path.basename(imagePath);
    const readStream = fs.createReadStream(imagePath);
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'image/jpeg',
      metadata: { authorId },
    });

    const gridFsId: string = await new Promise((resolve, reject) => {
      uploadStream.once('finish', () => resolve((uploadStream.id as any).toString()));
      uploadStream.once('error', reject);
      readStream.pipe(uploadStream);
    });

    // Create post record in SQL
    await db.post.create({
      data: { description, authorId, gridFsImageId: gridFsId }
    });

    console.log(`Seeded post '${description}' by ${authorId}, imageId=${gridFsId}`);
  }

  // 4. Clean up connections
  await db.$disconnect();
  await mongoClient.close();
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  });
