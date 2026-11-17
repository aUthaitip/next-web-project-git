-- Keep existing clinic data when upgrading a database created by Prisma.
CREATE TABLE IF NOT EXISTS "Appointment" (
    id SERIAL PRIMARY KEY,
    patient TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    phone TEXT NOT NULL,
    "petName" TEXT NOT NULL,
    "petType" TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER REFERENCES "User"(id),
    owner TEXT,
    "doctorName" TEXT,
    "petId" INTEGER
);
CREATE INDEX IF NOT EXISTS "Appointment_userId_createdAt_idx" ON "Appointment" ("userId", "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "Notification" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "User"(id),
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification" ("userId", "createdAt" DESC);
