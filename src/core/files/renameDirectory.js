import express from "express";
import fs from "fs";
import path from "path";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function renameDirectory(req, res) {
  const { name, newName, dirPath } = req.body;

  try {
    const base = path.basename(newName);
    const oldpath = path.join(dirPath, name);
    const newpath = path.join(dirPath, base);

    if (fs.existsSync(newpath)) {
      return res.status(400).json({
        error: `A file/directory already exists with the name of ${base}.`,
      });
    }

    if (fs.existsSync(oldpath)) {
      fs.rename(oldpath, newpath, (e) => {
        if (e) {
          console.error(e);
          return res.status(500).json({ error: "Internal server error." });
        }

        return res.status(200).json({ ok: "Successfully renamed." });
      });
    }
  } catch (e) {
    return res.status(500).json({ error: `Internal server error: ${e}` });
  }
}
