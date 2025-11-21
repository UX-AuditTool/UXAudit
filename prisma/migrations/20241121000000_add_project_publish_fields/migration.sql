-- AlterTable
ALTER TABLE "projects" ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "projects" ADD COLUMN "share_token" TEXT;
ALTER TABLE "projects" ADD COLUMN "published_at" TIMESTAMPTZ;

-- CreateIndex
CREATE UNIQUE INDEX "projects_share_token_key" ON "projects"("share_token");
