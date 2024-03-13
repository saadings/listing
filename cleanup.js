// cleanup.js or at the end of your application's lifecycle
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanup() {
  await prisma.$disconnect();
}

cleanup().then((c) => {
  console.log("Done", c)
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
