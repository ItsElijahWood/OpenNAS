import express from "express";
import { login } from "./core/auth/login.js";
import { authMiddleware } from "./core/auth/authMiddleware.js";

/**
 *
 * @param {express.Application} app
 */
export function router(app) {
  // Auth
  app.post("/auth/login", (req, res) => {
    login(req, res);
  });
  app.get("/auth/me", (req, res, next) => {
    authMiddleware(req, res, next);
    return res.status(200).json({ ok: `Welcome ${req.user.display_name}.`, display_name: req.user.display_name, username: req.user.username });
  });
}
