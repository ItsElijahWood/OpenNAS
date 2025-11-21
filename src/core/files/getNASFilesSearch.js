import express from "express";
import path from "path";
import fs from "fs";

/**
 *  @param {express.Request} req
 *  @param {express.Response} res
 */
export async function getNASFilesSearch(req, res) {
  const name = req.query.n;
  const recPath = req.query.r;

  if (!name || !recPath) {
    return res.status(400).json({ error: "Name or recPath is empty." });
  }

  const files = fetchFiles(name, recPath);

  if (!files) {
    return res.status(400).json({ ok: "File not found." });
  }

  return res.status(200).json({ ok: "File searched successfully.", files });
}

function fetchFiles(name, recPath) {
  let items;

  try {
    items = fs.readdirSync(recPath).filter((file) => !file.startsWith("."));
  } catch (e) {
    return [];
  }

  const matchedFiles = [];

  for (const item of items) {
    const fullDir = path.join(recPath, item);
    let stat;

    try {
      stat = fs.statSync(fullDir);
    } catch (e) {
      continue;
    }

    if (item.startsWith(name)) {
      matchedFiles.push({
        name: item,
        isDirectory: stat.isDirectory(),
        dirPath: recPath,
      });
    }
  }

  return matchedFiles;
}
