import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function login(req, res) {
  const { username, password } = req.body;

  const user_username = getEnv(res, "USERNAME");
  const user_password = getEnv(res, "PASSWORD");
  const display_name = getEnv(res, "DISPLAY_NAME");

  const JWT_TOKEN = getEnv(res, "JWT_TOKEN");

  if (username.toLowerCase() !== user_username.toLowerCase()) {
    return res.status(300).json({ error: "Username not found." });
  }
  if (password !== user_password) {
    return res.status(300).json({ error: "Password is incorrect." });
  }

  const token = jwt.sign(
    {
      username: user_username,
      display_name: display_name,
    },
    JWT_TOKEN,
    { expiresIn: "10d" }
  );

  res.cookie(token, "token", {
    secure: false,
    httpOnly: true,
    path: "/",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10d
  });
  return res.json({ ok: "Logged in successfully." });
}

function getEnv(res, name) {
  const value = process.env[name];

  if (value) {
    return value;
  } else {
    console.error("ENV is null or empty value.");
    return res.status(500).json({ error: "ENV is null or empty value." });
  }
}
