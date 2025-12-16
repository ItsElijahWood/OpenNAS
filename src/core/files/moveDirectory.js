import express from "express";
import fs from "fs";
import path from "path";
import { NASDatabase } from "../../database.js";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function moveDirectory(req, res) {
  const { name, newDir, dirPath, isDirectory, uid } = req.body;

  if (!uid && uid !== 0) return res.status(400).json({ error: "UID is null." });

  const conn = new NASDatabase();
  await conn.init();

  const MNT_POINT = await conn.get("SELECT mnt_point FROM users WHERE id = ?", [uid]);
  const protected_path = path.resolve(MNT_POINT.mnt_point);

  try {
    const oldpath = path.join(dirPath, name);
    const newpath = path.join(newDir, name);

    if (!oldpath.startsWith(protected_path) || !newpath.startsWith(protected_path)) {
      return res.status(403).json({ error: "You cannot move files outside of mnt_point." }); 
    }

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

        return res.status(200).json({
          ok: "Successfully moved.",
          file: {
            name,
            isDirectory,
            dirPath,
          },
        });
      });
    }
  } catch (e) {
    return res.status(500).json({ error: `Internal server error: ${e}` });
  }
}
