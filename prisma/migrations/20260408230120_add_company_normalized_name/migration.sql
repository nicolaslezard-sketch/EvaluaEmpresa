ALTER TABLE "Company" ADD COLUMN "normalizedName" TEXT;

UPDATE "Company"
SET "normalizedName" = lower(regexp_replace(btrim("name"), '\s+', ' ', 'g'))
WHERE "normalizedName" IS NULL;

ALTER TABLE "Company"
ALTER COLUMN "normalizedName" SET NOT NULL;

CREATE UNIQUE INDEX "Company_ownerId_normalizedName_key"
ON "Company"("ownerId", "normalizedName");