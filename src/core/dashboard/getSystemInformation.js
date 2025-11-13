import express from "express";
import os from "os";
import si from "systeminformation";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getSystemInformation(req, res) {
  const hostname = os.hostname();
  const platform = os.platform();
  const arch = os.arch();
  const uptime = os.uptime();

  const netStats = await si.networkStats();
  const nonInternal = netStats.filter((i) => !i.iface.includes("lo"));
  const inbound = nonInternal.reduce((sum, n) => sum + (n.rx_sec || 0), 0);
  const outbound = nonInternal.reduce((sum, n) => sum + (n.tx_sec || 0), 0);

  const bytesToHuman = (b) => {
    if (b === 0) return "0 B/s";
    const units = ["B/s", "KB/s", "MB/s", "GB/s"];
    const e = Math.floor(Math.log10(b) / 3);
    const n = b / Math.pow(1000, e);
    return `${n.toFixed(2)} ${units[e]}`;
  };

  if (!hostname || !platform || !arch || !uptime || !bytesToHuman) {
    return res.status(500).json({ error: "Internal server error." });
  }

  return res.status(200).json({
    hostname,
    platform,
    arch,
    uptime,
    network: {
      inbound_bytes_per_sec: inbound,
      outbound_bytes_per_sec: outbound,
      inbound_human: bytesToHuman(inbound),
      outbound_human: bytesToHuman(outbound),
    },
  });
}
