import express from "express";
import si from "systeminformation";

/**
  * @param {express.Request} req
  * @param {express.Response} res
  */
export async function getNASDrives(req, res) {
  const drives = await si.fsSize();

  const driveArray = [];
  const mntArray = [];
  for (const driveL of drives) {
    const mount = driveL.mount;
    const drive = driveL.fs;
    if (!mount.startsWith("/")) continue;

    driveArray.push({ fs: drive });
    mntArray.push({ mnt: mount });
  }

  return res.status(200).json({ driveArray, mntArray });
}
