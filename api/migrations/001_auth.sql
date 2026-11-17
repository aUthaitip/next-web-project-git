-- Compatible with the existing Prisma User table. Never drops existing tables.
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    image TEXT,
    "lineUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fail transactionally if existing users have case-insensitive email duplicates.
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_lower_key" ON "User" (lower(email));

CREATE TABLE IF NOT EXISTS "GoSession" (
    "tokenHash" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS "GoSession_userId_idx" ON "GoSession" ("userId");
CREATE INDEX IF NOT EXISTS "GoSession_expiresAt_idx" ON "GoSession" ("expiresAt");
