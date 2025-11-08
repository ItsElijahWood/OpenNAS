import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function database() {
  const conn = db();
}

/**
 *
 * @returns { Database }
 */
export async function db() {
  const pathToDir = path.resolve(__dirname, "./db");
  if (!fs.existsSync(pathToDir)) {
    fs.mkdirSync(pathToDir);

    const db = await open({
      filename: path.join(pathToDir, "OpenNAS.db"),
      driver: sqlite3.Database,
    });

    console.log("Database started.");

    return db;
  } else {
    const db = await open({
      filename: path.join(pathToDir, "OpenNAS.db"),
      driver: sqlite3.Database,
    });

    console.log("Database started.");

    return db;
  }
}
