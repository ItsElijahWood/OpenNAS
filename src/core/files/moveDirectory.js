import express from "express";
import fs from "fs";
import path from "path";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function moveDirectory(req, res) {
  const { name, newDir, dirPath, isDirectory } = req.body;

  try {
    const oldpath = path.join(dirPath, name);
    const newpath = path.join(newDir, name);

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
