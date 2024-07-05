-- CreateTable
CREATE TABLE "Continent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CountryData" (
    "countryId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("countryId", "datasetId"),
    CONSTRAINT "CountryData_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CountryData_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DatasetExcludes" (
    "datasetId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("datasetId", "value"),
    CONSTRAINT "DatasetExcludes_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ContinentToCountry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ContinentToCountry_A_fkey" FOREIGN KEY ("A") REFERENCES "Continent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ContinentToCountry_B_fkey" FOREIGN KEY ("B") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContinentToCountry_AB_unique" ON "_ContinentToCountry"("A", "B");

-- CreateIndex
CREATE INDEX "_ContinentToCountry_B_index" ON "_ContinentToCountry"("B");
