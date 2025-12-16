import express from "express";
import { NASDatabase } from "../../database.js";
import bcrypt from "bcrypt";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export async function createAccount(req, res) {
  const { username, uid, builtin, access, password, reason, mnt_point, disk } = req.body;

  const conn = new NASDatabase();
  await conn.init();

  const hash_password = await bcrypt.hash(password, 10);
  const hidden_password = "*".repeat(password.length);

  await conn.run("INSERT INTO users (username, password, mnt_point, reason, access, drive, builtin, hidden_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [username, hash_password, mnt_point, reason, access, disk, builtin, hidden_password]);
  await conn.close();

  return res.status(200).json({ ok: "Created account successfully." });
}

