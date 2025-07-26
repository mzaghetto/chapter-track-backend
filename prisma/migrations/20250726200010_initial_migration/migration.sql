-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ManhwaStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS');

-- CreateEnum
CREATE TYPE "UserManhwaStatus" AS ENUM ('READING', 'PAUSED', 'DROPPED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('TELEGRAM', 'WEBSITE', 'EMAIL', 'PUSH');

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "preferences" JSONB,
    "lastLogin" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "telegramId" TEXT,
    "telegramActive" BOOLEAN NOT NULL DEFAULT false,
    "telegramLinkingToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manhwas" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT,
    "genre" JSONB,
    "coverImage" TEXT,
    "description" TEXT,
    "status" "ManhwaStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manhwas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Providers" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManhwaProvider" (
    "id" BIGSERIAL NOT NULL,
    "manhwaId" BIGINT NOT NULL,
    "providerId" BIGINT NOT NULL,
    "lastEpisodeReleased" DOUBLE PRECISION,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManhwaProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserManhwa" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "manhwaId" BIGINT NOT NULL,
    "providerId" BIGINT,
    "status" "UserManhwaStatus" NOT NULL,
    "lastEpisodeRead" DOUBLE PRECISION,
    "lastNotifiedEpisode" DOUBLE PRECISION,
    "order" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserManhwa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotifications" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "manhwaId" BIGINT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_telegramLinkingToken_key" ON "Users"("telegramLinkingToken");

-- CreateIndex
CREATE INDEX "Users_username_idx" ON "Users"("username");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_preferences_idx" ON "Users"("preferences");

-- CreateIndex
CREATE INDEX "Manhwas_genre_idx" ON "Manhwas"("genre");

-- CreateIndex
CREATE INDEX "ManhwaProvider_manhwaId_idx" ON "ManhwaProvider"("manhwaId");

-- CreateIndex
CREATE INDEX "ManhwaProvider_providerId_idx" ON "ManhwaProvider"("providerId");

-- CreateIndex
CREATE INDEX "UserManhwa_userId_idx" ON "UserManhwa"("userId");

-- CreateIndex
CREATE INDEX "UserManhwa_manhwaId_idx" ON "UserManhwa"("manhwaId");

-- CreateIndex
CREATE INDEX "UserManhwa_providerId_idx" ON "UserManhwa"("providerId");

-- CreateIndex
CREATE INDEX "UserNotifications_userId_idx" ON "UserNotifications"("userId");

-- CreateIndex
CREATE INDEX "UserNotifications_manhwaId_idx" ON "UserNotifications"("manhwaId");

-- AddForeignKey
ALTER TABLE "ManhwaProvider" ADD CONSTRAINT "ManhwaProvider_manhwaId_fkey" FOREIGN KEY ("manhwaId") REFERENCES "Manhwas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManhwaProvider" ADD CONSTRAINT "ManhwaProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserManhwa" ADD CONSTRAINT "UserManhwa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserManhwa" ADD CONSTRAINT "UserManhwa_manhwaId_fkey" FOREIGN KEY ("manhwaId") REFERENCES "Manhwas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserManhwa" ADD CONSTRAINT "UserManhwa_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_manhwaId_fkey" FOREIGN KEY ("manhwaId") REFERENCES "Manhwas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
