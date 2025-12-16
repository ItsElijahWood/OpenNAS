import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NASDatabase } from "../../database.js";
import bcrypt from "bcrypt";

dotenv.config({ quiet: true });

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function login(req, res) {
  const { username, password } = req.body;

  const conn = new NASDatabase();
  await conn.init();

  const data = await conn.get("SELECT * FROM users WHERE username = ?", [username]);
  if (!data) return res.status(400).json({ error: "Username not found." });

  const JWT_TOKEN = getEnv("JWT_TOKEN");

  if (username.toLowerCase() !== data.username) {
    return res.status(400).json({ error: "Username not found." });
  }

  const passCorrect = await bcrypt.compare(password, data.password);
  if (!passCorrect) {
    return res.status(400).json({ error: "Password is incorrect." });
  }

  const token = jwt.sign(
    {
      username: username,
      uid: data.id
    },
    JWT_TOKEN,
    { expiresIn: "10d" }
  );

  res.cookie("token", token, {
    secure: false,
    httpOnly: true,
    path: "/",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10d
  });
  return res.json({ ok: "Logged in successfully." });
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error("Missing env.");
  return value;
}
