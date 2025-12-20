import express from "express";
import { NASDatabase } from "../../database.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export async function createAccount(req, res) {
  const { username, uid, builtin, access, password, reason, mnt_point, disk } = req.body;

  if (!username || !uid || !builtin || !access || !password || !mnt_point || !disk) {
    return res.status(400).json({ error: "One or all body values are null." });
  }

  const conn = new NASDatabase();
  await conn.init();

  const getAccounts = await conn.get("SELECT * FROM users WHERE username = ?", [username]);
  if (getAccounts) {
    return res.status({ error: "Account already exists." });
  }

  const hash_password = await bcrypt.hash(password, 10);
  const hidden_password = "*".repeat(password.length);

  const MNT_POINT = path.join(mnt_point, username);

  await conn.run("INSERT INTO users (username, password, mnt_point, reason, access, drive, builtin, hidden_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [username, hash_password, MNT_POINT, reason, access, disk, builtin, hidden_password]);
  await conn.close();

  if (fs.existsSync(MNT_POINT)) return res.status({ error: "Directory already exists." });
  fs.mkdirSync(MNT_POINT);

  return res.status(200).json({ ok: "Created account successfully." });
}

