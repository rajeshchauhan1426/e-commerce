import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client as a singleton
const client = globalThis.prisma || new PrismaClient();

// Ensure Prisma Client is only initialized once in development mode
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export default client;
