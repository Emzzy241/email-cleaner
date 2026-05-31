const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;

// const PrismaClient = require('@prisma/client');
// const PrismaPg = require('@prisma/adapter-pg');
// const pg = require('pg');

// // Create a standard native pool using your environment variable
// const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaPg(pool);

// // Pass the driver adapter directly to Prisma 7
// const prisma = new PrismaClient({ adapter });

// module.exports = prisma;