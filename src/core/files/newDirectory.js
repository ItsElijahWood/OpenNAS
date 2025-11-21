import express from "express";
import fs from "fs";
import path from "path";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function newDirectory(req, res) {
  const name = req.query.n;
  const pathDir = req.query.p;

  if (!name) {
    return res.status(400).json({ error: "Name is empty." });
  }

  try {
    const fullDir = path.join(pathDir, name);

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir);
    } else {
      return res.status(400).json({ error: "Directory already exists." });
    }

    return res.status(200).json({
      ok: "Created directory successfully.",
      files: { name: name, dirPath: pathDir, isDirectory: true },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error." });
  }
}
