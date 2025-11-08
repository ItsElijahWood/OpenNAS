import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next
 */
export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unathorised access." });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decode;

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Unathorised access." });
  }
}
