import express from "express";
import { login } from "./core/auth/login.js";

/**
 *
 * @param {express.Application} app
 */
export function router(app) {
  // Auth
  app.post("/auth/login", (req, res) => {
    login(req, res);
  });
}
