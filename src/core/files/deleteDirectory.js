import fs from "fs";
import path from "path";
import express from "express";
import { rm } from "node:fs/promises";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function deleteDirectory(req, res) {
  const { name, dirPath } = req.body;

  try {
    const directory = path.join(dirPath, name);
    if (fs.existsSync(directory)) {
      await rm(directory, { force: true, recursive: true });
    } else {
      return res.status(500).json({ error: "Directory does not exist." });
    }

    return res.status(200).json({ ok: "Deleted directory successfully." });
  } catch (e) {
    return res.status(500).json({ error: `Internal server error: ${e}` });
  }
}
