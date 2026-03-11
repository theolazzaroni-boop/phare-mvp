-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'READY', 'PUBLISHED', 'REVISION_REQUESTED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "publishTime" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionRequest" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevisionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyNews" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyStats" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "engagements" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionRequest" ADD CONSTRAINT "RevisionRequest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyNews" ADD CONSTRAINT "WeeklyNews_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyStats" ADD CONSTRAINT "WeeklyStats_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
