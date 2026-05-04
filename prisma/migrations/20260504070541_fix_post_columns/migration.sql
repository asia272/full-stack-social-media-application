/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('PROJECT', 'QUESTION', 'POST');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "techStack" TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'POST';
