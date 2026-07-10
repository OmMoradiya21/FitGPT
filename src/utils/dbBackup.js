import { exportDB, importDB, peakImportFile } from "dexie-export-import";
import { db } from "../config/db.js";

export async function exportDatabase() {
  const blob = await exportDB(db);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "FitGPT-Backup.dexie";
  a.click();

  URL.revokeObjectURL(url);
}

export async function importDatabase(file) {
  const confirmed = window.confirm(
    "Importing will replace all your existing data. Do you want to continue?",
  );
  if (!confirmed) {
    return;
  }
  if (!file.name.endsWith(".dexie")) {
    alert("Please select a valid .dexie backup file.");
    return;
  }

  try {
    // 1. Validate the backup file first using peakImportFile
    const importMeta = await peakImportFile(file);
    if (importMeta.formatName !== "dexie") {
      alert("Invalid backup file format.");
      return;
    }

    const expectedTables = ["profile", "history"];
    const hasAllTables = expectedTables.every((table) =>
      importMeta.data.tables.some((t) => t.name === table),
    );

    if (!hasAllTables) {
      alert("This backup is not compatible with this application.");
      return;
    }

    // 2. If valid, close and delete the current database
    await db.close();
    await db.delete();

    // 3. Import the backup (only once)
    const importedDB = await importDB(file);
    importedDB.close();

    alert("Data imported successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Failed to import database:", error);
    alert("Failed to import database: " + error.message);
  }
}

