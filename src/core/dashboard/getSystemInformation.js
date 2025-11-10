import express from "express";
import os from "os";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function getSystemInformation(req, res) {
  const hostname = os.hostname();
  const platform = os.platform();
  const arch = os.arch();
  const uptime = os.uptime();

  if (!hostname || !platform || !arch || !uptime) {
    return res.status(500).json({ error: "Internal server error." });
  }

  return res.status(200).json({ hostname, platform, arch, uptime });
}
