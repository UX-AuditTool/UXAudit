import { PrismaClient } from '@prisma/client';
import { getAzureDatabaseUrl } from './azure-auth';

// Global Prisma client instance
let prisma: PrismaClient | null = null;
let tokenExpiryTime: number | null = null;

// Token expires after 55 minutes (Azure tokens are valid for 60 minutes)
const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000;

/**
 * Get or create Prisma client with Azure AD authentication
 * Automatically refreshes Azure AD token when needed
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  const now = Date.now();

  // If client exists and token hasn't expired, return existing client
  if (prisma && tokenExpiryTime && now < tokenExpiryTime) {
    return prisma;
  }

  // Disconnect old client if it exists
  if (prisma) {
    await prisma.$disconnect();
  }

  // Get fresh database URL with new token
  const databaseUrl = await getAzureDatabaseUrl();

  // Create new Prisma client
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Set token expiry time
  tokenExpiryTime = now + TOKEN_REFRESH_INTERVAL;

  return prisma;
}

/**
 * Disconnect Prisma client (cleanup)
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    tokenExpiryTime = null;
  }
}

// Auto-disconnect on process exit
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    disconnectPrisma().catch(console.error);
  });
}
