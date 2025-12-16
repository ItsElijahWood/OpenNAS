import express from "express";
import { NASDatabase } from "../database.js";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export async function getHighestUID(req, res) {
  const conn = new NASDatabase(); 
  await conn.init(); 

  const highestId = await conn.get("SELECT MAX(id) AS uid FROM users");

  return res.status(200).json({ uid: highestId.uid });
}
