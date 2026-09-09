import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL
  if (!url) return false
  if (url.includes('xxxxx') || url.includes('YOUR_') || url.includes('...')) return false
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) return false
  return true
}
