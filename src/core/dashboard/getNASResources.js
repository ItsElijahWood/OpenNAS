import express from "express";
import si from "systeminformation";
import dotenv from "dotenv";
import os from "os";

dotenv.config({ quiet: true });

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
export async function getNASResources(req, res) {
  let infomation = {};
  const NAS_DRIVE = process.env.NAS_DRIVE;

  if (!NAS_DRIVE) {
    return res.status(300).json({ error: "NAS_DRIVE .env is null." });
  }

  const cpu = await si.cpu();
  const ram = await si.mem();

  const drives = await si.fsSize();
  const specific_drive = drives.find((d) => d.fs === NAS_DRIVE);

  const cpu_percentage = await getCpuUsage();

  const info = {
    drive: {
      size: specific_drive.size || "",
      used: specific_drive.used || "",
      available: specific_drive.available || "",
    },
    cpu: {
      usage: cpu_percentage,
      brand: cpu.brand,
      speed: cpu.speed,
      cores: cpu.cores,
    },
    ram: {
      total: ram.total,
      free: ram.free,
      used: ram.used,
    },
  };

  infomation = info;
  return res.status(200).json(infomation);
}

function getCpuUsage() {
  const cpus1 = os.cpus();

  return new Promise((resolve) => {
    setTimeout(() => {
      const cpus2 = os.cpus();

      let totalDiff = 0;
      let idleDiff = 0;

      for (let i = 0; i < cpus1.length; i++) {
        const t1 = cpus1[i].times;
        const t2 = cpus2[i].times;

        const idle = t2.idle - t1.idle;
        const total =
          t2.user +
          t2.nice +
          t2.sys +
          t2.idle +
          t2.irq -
          (t1.user + t1.nice + t1.sys + t1.idle + t1.irq);

        totalDiff += total;
        idleDiff += idle;
      }

      const usage = ((totalDiff - idleDiff) / totalDiff) * 100;
      resolve(usage.toFixed(2));
    }, 2000);
  });
}
