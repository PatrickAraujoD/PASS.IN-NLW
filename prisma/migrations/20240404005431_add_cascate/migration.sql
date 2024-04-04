-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check_in" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" INTEGER NOT NULL,
    CONSTRAINT "check_in_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_in" ("attendee_id", "create_at", "id") SELECT "attendee_id", "create_at", "id" FROM "check_in";
DROP TABLE "check_in";
ALTER TABLE "new_check_in" RENAME TO "check_in";
CREATE UNIQUE INDEX "check_in_attendee_id_key" ON "check_in"("attendee_id");
CREATE TABLE "new_attendes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "attendes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendes" ("create_at", "email", "event_id", "id", "name") SELECT "create_at", "email", "event_id", "id", "name" FROM "attendes";
DROP TABLE "attendes";
ALTER TABLE "new_attendes" RENAME TO "attendes";
CREATE UNIQUE INDEX "attendes_event_id_email_key" ON "attendes"("event_id", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
