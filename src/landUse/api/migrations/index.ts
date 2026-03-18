import type { LandUseDbMigration, LandUseDbMigrationContext } from "./types";

type MigrationModule = Record<string, unknown>;

const isLandUseDbMigration = (
  candidate: unknown,
): candidate is LandUseDbMigration => {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  }

  const maybeMigration = candidate as Partial<LandUseDbMigration>;
  return (
    typeof maybeMigration.version === "number" &&
    Number.isInteger(maybeMigration.version) &&
    maybeMigration.version > 0 &&
    typeof maybeMigration.migrate === "function"
  );
};

const migrationModules = import.meta.glob<MigrationModule>(
  "./[0-9][0-9][0-9]_*.ts",
  { eager: true },
);

const discoveredMigrations = Object.values(migrationModules)
  .flatMap((moduleExports) => Object.values(moduleExports))
  .filter(isLandUseDbMigration);

const landUseMigrations: LandUseDbMigration[] = discoveredMigrations.sort(
  (a, b) => a.version - b.version,
);

const validateMigrations = (migrations: LandUseDbMigration[]): void => {
  if (migrations.length === 0) {
    throw new Error("No migrations found in src/landUse/api/migrations");
  }

  const versions = migrations.map((migration) => migration.version);
  const uniqueVersions = new Set(versions);

  if (uniqueVersions.size !== versions.length) {
    throw new Error(
      `Duplicate migration versions detected: ${versions.join(", ")}`,
    );
  }

  for (let index = 0; index < versions.length; index += 1) {
    const expectedVersion = index + 1;
    const actualVersion = versions[index];

    if (actualVersion !== expectedVersion) {
      throw new Error(
        `Migration sequence is invalid. Expected version ${expectedVersion} but found ${actualVersion}.`,
      );
    }
  }
};

validateMigrations(landUseMigrations);

export const LAND_USE_DB_VERSION =
  landUseMigrations[landUseMigrations.length - 1]?.version ?? 1;

export const applyLandUseMigrations = (
  oldVersion: number,
  context: LandUseDbMigrationContext,
): void => {
  const pendingMigrations = landUseMigrations.filter(
    (migration) => migration.version > oldVersion,
  );

  pendingMigrations.forEach((migration) => {
    migration.migrate(context);
  });
};
