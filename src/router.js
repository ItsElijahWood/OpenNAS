import express from "express";
import { login } from "./core/auth/login.js";
import { authMiddleware } from "./core/auth/authMiddleware.js";
import { getNASResources } from "./core/dashboard/getNASResources.js";
import { getSystemInformation } from "./core/dashboard/getSystemInformation.js";
import { getNASFiles } from "./core/files/getNASFiles.js";
import { deleteDirectory } from "./core/files/deleteDirectory.js";
import { renameDirectory } from "./core/files/renameDirectory.js";

/**
 *
 * @param {express.Application} app
 */
export function router(app) {
  // Auth
  app.post("/auth/login", (req, res) => {
    login(req, res);
  });
  app.get("/auth/me", authMiddleware, (req, res, next) => {
    return res.status(200).json({
      ok: `Welcome ${req.user.display_name}.`,
      display_name: req.user.display_name,
      username: req.user.username,
    });
  });

  // Dashboard
  app.get("/dashboard/get-resources", (req, res) => {
    getNASResources(req, res);
  });
  app.get("/dashboard/get-system-information", (req, res) => {
    getSystemInformation(req, res);
  });

  // Files
  app.get("/files/get-nas-drive-env", (req, res) => {
    getNASDriveEnv(req, res);
  });
  app.post("/files/get-nas-files", (req, res) => {
    getNASFiles(req, res);
  });
  app.post("/files/delete-directory", (req, res) => {
    deleteDirectory(req, res);
  });
  app.post("/files/rename-directory", (req, res) => {
    renameDirectory(req, res);
  });
}
