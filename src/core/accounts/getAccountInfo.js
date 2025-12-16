import express from "express";
import { NASDatabase } from "../../database.js";

/**
  *
  * @param {express.Request} req,
  * @param {express.Response} res
  */
export async function getAccountInfo(req, res) {
  const { uid } = req.body;

  if (!uid && uid !== 0) return res.status(400).json({ error: "UID is null." });

  const conn = new NASDatabase();
  await conn.init();

  const data = await conn.get("SELECT * FROM users");
  return res.status(200).json({ ok: "Accounts info fetched successfully.", data });
}
