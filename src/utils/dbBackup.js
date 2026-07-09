import { exportDB, importDB } from "dexie-export-import";
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
  const confirm = window.confirm(
    "Importing will replace all your existing data. Do you want to continue?",
  );
  if (!confirm) {
    return;
  }
  if (!file.name.endsWith(".dexie")) {
    alert("Please select a valid .dexie backup file.");
    return;
  }

  try {
    const importedDB = await importDB(file);
    const expectedTables = ["profile", "history"];
    const hasAllTables = expectedTables.every((table) =>
      importedDB.tables.some((t) => t.name === table),
    );

    if (!hasAllTables) {
      importedDB.close();
      alert("This backup is not compatible with this application.");
      return;
    }
    importedDB.close();

    await db.delete();
    await importDB(file);

    alert("Data imported successfully! Click OK to refresh the application.");
    window.location.reload();
  } catch (error) {
    console.error("Failed to import database:", error);
    alert("Failed to import database: " + error.message);
  }
}
