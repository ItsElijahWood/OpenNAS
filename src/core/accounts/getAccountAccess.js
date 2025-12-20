import express from "express";
import { NASDatabase } from "../../database.js";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export async function getAccountAccess(req, res) {
  const { id } = req.body;

  const conn = new NASDatabase();
  await conn.init();

  const level = await conn.get("SELECT access FROM users WHERE id = ?", [id]);
  await conn.close();

  if (!level) return res.status(500).json({ error: "Access not found." });
  
  return res.status(200).json({ access: level.access });
}
