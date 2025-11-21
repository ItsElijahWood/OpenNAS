import express from "express";
import path from "path";
import archiver from "archiver";
import fs from "fs";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function downloadFile(req, res) {
  const { dirPath, name } = req.body;

  if (!dirPath || !name)
    return res.status(400).json({ error: "dirPath or name is empty." });

  const fullPath = path.join(dirPath, name);
  if (!fs.existsSync(fullPath)) {
    return res.status(400).json({ error: "File or directory not found." });
  }

  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    res.setHeader("Content-Disposition", `attachment; filename=${name}.tar.gz`);
    res.setHeader("Content-Type", "application/gzip");

    const archive = archiver("tar", { gzip: true, gzipOptions: { level: 9 } });
    archive.directory(fullPath, false);
    archive.pipe(res);
    await archive.finalize();

    return;
  } else {
    return res.download(fullPath);
  }
}
