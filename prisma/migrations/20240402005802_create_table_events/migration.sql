-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximun_attendes" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");
