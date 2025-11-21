import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ quiet: true });

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function getNASFiles(req, res) {
  const { recPath, back, Name } = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const NAS_MNT_POINT = process.env.NAS_MNT_POINT;
  if (!NAS_MNT_POINT) {
    return res.status(500).json({ error: "NAS_DRIVE env is null." });
  }

  if (recPath) {
    return getNASFilesRecursive(
      res,
      recPath,
      back,
      Name,
      NAS_MNT_POINT,
      __filename,
      __dirname
    );
  }

  const pathToDir = path.resolve(__dirname, `${NAS_MNT_POINT}`);
  const readDir = fs
    .readdirSync(pathToDir)
    .filter((file) => !file.startsWith("."));

  const files = [];
  for (const file of readDir) {
    const fullPath = path.join(pathToDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push({ name: file, dirPath: pathToDir, isDirectory: true });
    } else if (stat.isFile()) {
      files.push({ name: file, dirPath: pathToDir, isDirectory: false });
    }
  }

  return res
    .status(200)
    .json({ files, dirPath: pathToDir, mnt_point: NAS_MNT_POINT });
}

function getNASFilesRecursive(
  res,
  recPath,
  back,
  Name,
  NAS_MNT_POINT,
  __filename,
  __dirname
) {
  if (back) {
    const files = [];
    const recursivePath = path.dirname(recPath);
    try {
      const readDir = fs
        .readdirSync(recursivePath)
        .filter((file) => !file.startsWith("."));

      for (const file of readDir) {
        const fullPath = path.join(recursivePath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push({ name: file, dirPath: recursivePath, isDirectory: true });
        } else if (stat.isFile()) {
          files.push({
            name: file,
            dirPath: recursivePath,
            isDirectory: false,
          });
        }
      }

      return res
        .status(200)
        .json({ files, dirPath: recursivePath, mnt_point: NAS_MNT_POINT });
    } catch (e) {
      return res
        .status(200)
        .json({ files, dirPath: recursivePath, mnt_point: NAS_MNT_POINT });
    }
  }

  const files = [];
  let pathToDir;
  if (Name) {
    pathToDir = path.join(recPath, Name);
  } else {
    pathToDir = recPath;
  }

  try {
    const readDir = fs
      .readdirSync(pathToDir)
      .filter((file) => !file.startsWith("."));

    for (const file of readDir) {
      const fullPath = path.join(pathToDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push({ name: file, dirPath: pathToDir, isDirectory: true });
      } else if (stat.isFile()) {
        files.push({ name: file, dirPath: pathToDir, isDirectory: false });
      }
    }

    return res
      .status(200)
      .json({ files, dirPath: pathToDir, mnt_point: NAS_MNT_POINT });
  } catch (e) {
    return res
      .status(200)
      .json({ files, dirPath: pathToDir, mnt_point: NAS_MNT_POINT });
  }
}
