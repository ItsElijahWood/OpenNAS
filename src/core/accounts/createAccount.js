import express from "express";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export function createAccount(req, res) {
  const { username, uid, builtin, access, password, reason, mnt_point, disk } = req.body;
}

