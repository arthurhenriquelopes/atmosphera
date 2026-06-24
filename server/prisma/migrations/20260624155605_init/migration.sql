-- CreateTable
CREATE TABLE "WeatherRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "dateStart" DATETIME NOT NULL,
    "dateEnd" DATETIME NOT NULL,
    "temperature" REAL NOT NULL,
    "feelsLike" REAL,
    "humidity" INTEGER,
    "windSpeed" REAL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "rawData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
