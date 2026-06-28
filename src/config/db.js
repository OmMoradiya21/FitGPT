// db.js
import Dexie from "dexie";

const isBrowser = typeof window !== "undefined" || typeof globalThis.indexedDB !== "undefined";

export let db;

if (isBrowser) {
  db = new Dexie("FitGPT");
  db.version(1).stores({
    profile: "++id, date",
    history: "++id, date, completed",
  });
} else {
  // Mock database for testing in Node.js
  db = {
    profile: {
      toCollection: () => ({
        last: async () => ({
          APIKey: import.meta.env.VITE_OPENROUTER_APIKEY
        })
      })
    },
    history: {
      orderBy: () => ({
        reverse: () => ({
          limit: () => ({
            toArray: async () => []
          })
        })
      })
    }
  };
}

