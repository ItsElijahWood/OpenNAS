import express from "express";
import { login } from "./core/auth/login.js";
import { authMiddleware } from "./core/auth/authMiddleware.js";
import { getNASResources } from "./core/dashboard/getNASResources.js";
import { getSystemInformation } from "./core/dashboard/getSystemInformation.js";
import { getNASFiles } from "./core/files/getNASFiles.js";
import { deleteDirectory } from "./core/files/deleteDirectory.js";
import { renameDirectory } from "./core/files/renameDirectory.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { newDirectory } from "./core/files/newDirectory.js";
import { moveDirectory } from "./core/files/moveDirectory.js";
import { getNASFilesSearch } from "./core/files/getNASFilesSearch.js";
import { downloadFile } from "./core/files/downloadFile.js";
import { getAccountInfo } from "./core/accounts/getAccountInfo.js";
import { getNASDrives } from "./core/accounts/getNASDrives.js";
import { getHighestUID } from "./core/getHighestUID.js";
import { createAccount } from "./core/accounts/createAccount.js";

/**
 *
 * @param {express.Application} app
 */
export function router(app) {
  // Global functions
  app.get("/global/get-highest-id", (req, res) => {
    getHighestUID(req, res);
  });
  // Auth
  app.post("/auth/login", (req, res) => {
    login(req, res);
  });
  app.get("/auth/me", authMiddleware, (req, res, next) => {
    return res.status(200).json({
      ok: `Welcome ${req.user.display_name}.`,
      display_name: req.user.display_name,
      username: req.user.username,
      uid: req.user.uid,
    });
  });

  // Dashboard
  app.get("/dashboard/get-resources", (req, res) => {
    getNASResources(req, res);
  });
  app.get("/dashboard/get-system-information", (req, res) => {
    getSystemInformation(req, res);
  });

  // Accounts
  app.post("/accounts/info", (req, res) => {
    getAccountInfo(req, res);
  });
  app.get("/accounts/get-drives", (req, res) => {
    getNASDrives(req, res);
  });
  app.post("/accounts/create-account", (req, res) => {
    createAccount(req, res);
  });

  // Files
  app.post("/files/get-nas-files", (req, res) => {
    getNASFiles(req, res);
  });
  app.post("/files/delete-directory", (req, res) => {
    deleteDirectory(req, res);
  });
  app.post("/files/rename-directory", (req, res) => {
    renameDirectory(req, res);
  });
  app.post("/files/move-directory", (req, res) => {
    moveDirectory(req, res);
  });
  app.get("/files/new-directory", (req, res) => {
    newDirectory(req, res);
  });
  app.get("/files/search", (req, res) => {
    getNASFilesSearch(req, res);
  });
  app.post("/files/download", (req, res) => {
    downloadFile(req, res);
  });
  app.post("/files/upload/file", (req, res) => {
    const dirPath = req.query.path;
    const isDirectory = false;

    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        if (!dirPath) {
          return cb(new Error("dirPath is null."));
        }

        if (fs.existsSync(path.join(dirPath, file.originalname))) {
          return res.status(400).json({
            error: `File with the name of '${file.originalname}' already exists.`,
          });
        }

        cb(null, dirPath);
      },
      filename: function(req, file, cb) {
        cb(null, path.basename(file.originalname));
      },
    });
    const upload = multer({ storage }).array("files", 50);

    upload(req, res, (e) => {
      if (e) {
        return res.status(400).json({ error: e.message });
      }

      const uploadedFiles = req.files.map((file) => ({
        name: file.originalname,
        dirPath,
        isDirectory,
      }));

      return res
        .status(200)
        .json({ ok: "Files uploaded.", files: uploadedFiles });
    });
  });

  app.post("/files/upload/directory", (req, res) => {
    const dirPath = req.query.path;
    const isDirectory = true;

    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        if (!dirPath) {
          return cb(new Error("dirPath is null."));
        }

        const dirname = path.dirname(file.originalname);
        const fullDir = path.join(dirPath, dirname);

        fs.mkdirSync(fullDir, { recursive: true });

        cb(null, fullDir);
      },
      filename: function(req, file, cb) {
        cb(null, path.basename(file.originalname));
      },
    });
    const upload = multer({ storage, preservePath: true }).array("files", 1000);

    upload(req, res, (e) => {
      if (e) {
        return res.status(400).json({ error: e.message });
      }

      const uploadedFiles = req.files.map((file) => ({
        name: path.dirname(file.originalname),
        dirPath: dirPath,
        isDirectory,
      }));

      return res.status(200).json({
        ok: "Files uploaded.",
        files: uploadedFiles,
      });
    });
  });
}
