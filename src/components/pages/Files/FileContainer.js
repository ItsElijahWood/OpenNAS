import { useEffect, useState } from "react";
import DirectoryIcon from "../../svgs/DirectoryIcon";
import FileIcon from "../../svgs/FileIcon";
import MenuIconHorizontal from "../../svgs/MenuIconHorizontal";

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** i;

  return `${value.toFixed(decimals)} ${units[i]}`;
}

function FileContainer() {
  const [files, setFiles] = useState([]);
  const [displayBackPath, setDisplayBackPath] = useState(true);
  const [backPath, setBackPath] = useState("");
  const [cpu, setCPU] = useState([]);
  const [diskTotal, setDiskTotal] = useState("");
  const [diskUsed, setDiskUsed] = useState("");
  const [uptime, setUptime] = useState("");
  const [ramTotal, setRamTotal] = useState("");
  const [ramUsed, setRamUsed] = useState("");
  const [inBound, setInBound] = useState("");
  const [outBound, setOutBound] = useState("");
  const [confirmationFile, setConfirmationFile] = useState([]);
  const [renamingFile, setRenamingFile] = useState([]);

  useEffect(() => {
    let intervalId;
    async function getNASResources() {
      const response = await fetch("/dashboard/get-resources", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        const cpu_percentage = data.cpu.usage;
        const ramTotal = data.ram.total;
        const ramUsed = data.ram.used;
        const drive_total = data.drive.size;
        const drive_used = data.drive.used;

        setDiskUsed(formatBytes(drive_used));
        setDiskTotal(formatBytes(drive_total));
        setCPU(cpu_percentage);
        setRamTotal(formatBytes(ramTotal));
        setRamUsed(formatBytes(ramUsed));
      }
    }

    getNASResources();

    intervalId = setInterval(getNASResources, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let intervalId;

    async function getSystemInformation() {
      const response = await fetch("/dashboard/get-system-information", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        const uptimeSeconds = data.uptime;
        const inbound = data.network.inbound_human;
        const outbound = data.network.outbound_human;

        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const uptime = `${hours}h ${minutes}m ${seconds}s`;

        setUptime(uptime);
        setInBound(inbound);
        setOutBound(outbound);
      }
    }

    getSystemInformation();

    intervalId = setInterval(getSystemInformation, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getFiles();
  }, []);

  async function getFiles() {
    const response = await fetch("/files/get-nas-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      setFiles(data.files);
      if (data.mnt_point === data.dirPath) {
        setDisplayBackPath(false);
      } else {
        setDisplayBackPath(true);
      }
    }
  }

  async function getRecFiles(recPath, back, Name, isDirectory) {
    if (!isDirectory) {
      return;
    }

    if (Name) {
      const response = await fetch("/files/get-nas-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recPath, back, Name }),
      });

      if (response.ok) {
        const data = await response.json();

        setFiles(data.files);
        setBackPath(data.dirPath);
        if (data.mnt_point === data.dirPath) {
          setDisplayBackPath(false);
        } else {
          setDisplayBackPath(true);
        }
      }
    } else {
      const response = await fetch("/files/get-nas-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recPath, back }),
      });

      if (response.ok) {
        const data = await response.json();

        setFiles(data.files);
        setBackPath(data.dirPath);
        if (data.mnt_point === data.dirPath) {
          setDisplayBackPath(false);
        } else {
          setDisplayBackPath(true);
        }
      }
    }
  }

  function openFileMenu(idx) {
    const menu = document.getElementById(
      `component-files-filescontainer-inner-div-menu-${idx}`
    );

    menu.classList.toggle("visible");

    if (menu.classList.contains("visible")) {
      const handleOutsideClick = (event) => {
        const button = document.getElementById(
          `component-files-filescontainer-inner-div-menubutton-${idx}`
        );

        if (
          menu &&
          !menu.contains(event.target) &&
          !button.contains(event.target)
        ) {
          menu.classList.remove("visible");
          document.removeEventListener("mousedown", handleOutsideClick);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
    }
  }

  function openDeleteConfirmationMenu(name, isDirectory, dirPath, idx) {
    const confirmMenu = document.getElementById(
      "component-files-delete-confirmation"
    );

    setConfirmationFile([name, isDirectory, dirPath, idx]);
    confirmMenu.classList.toggle("visible");
  }

  function openRenamingMenu(name, isDirectory, dirPath, idx) {
    const renameMenu = document.getElementById("component-files-rename");

    setRenamingFile([name, isDirectory, dirPath, idx]);
    renameMenu.classList.toggle("visible");
  }

  async function deleteDirectory() {
    const name = confirmationFile[0];
    const dirPath = confirmationFile[2];

    if (!name || !dirPath) {
      throw new Error("Name or dirPath is null when deleting a directory.");
    }

    const response = await fetch("/files/delete-directory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, dirPath }),
    });

    if (response.ok) {
      const idx = confirmationFile[3];

      setFiles((prev) => prev.filter((_, i) => i !== idx));
      openDeleteConfirmationMenu(null, null, null, null);
    }
  }

  async function renameDirectory() {
    const name = renamingFile[0];
    const newName = document.getElementById(
      "component-files-rename-inner-buttons-div-input"
    ).value;
    const dirPath = renamingFile[2];

    if (!name || !newName || !dirPath) {
      return;
    }

    const response = await fetch("/files/rename-directory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, newName, dirPath }),
    });

    if (response.ok) {
      const idx = renamingFile[3];

      setFiles((prev) =>
        prev.map((file, i) => (i === idx ? { ...file, name: newName } : file))
      );
      openRenamingMenu(null, null, null, null);
    } else {
      const data = await response.json();

      alert(data.error);
    }
  }

  return (
    <>
      <div className="component-files-filescontainer">
        <div className="component-files-filescontainer-inner">
          {displayBackPath && (
            <div className="component-files-filescontainer-inner-div">
              <DirectoryIcon />
              <p
                onClick={() => getRecFiles(backPath, true, null, true)}
                className="component-files-filescontainer-inner-div-p-directory">
                ..
              </p>
            </div>
          )}
          {files &&
            files.map((file, idx) => (
              <div
                className="component-files-filescontainer-inner-div"
                id={`component-files-filescontainer-inner-div-${idx}`}
                key={idx}>
                {file.isDirectory === true ? <DirectoryIcon /> : <FileIcon />}
                <p
                  onClick={() =>
                    getRecFiles(file.dirPath, null, file.name, file.isDirectory)
                  }
                  className={`component-files-filescontainer-inner-div-p-${
                    file.isDirectory ? "directory" : "file"
                  }`}>
                  {file.name}
                </p>
                <div
                  id={`component-files-filescontainer-inner-div-menubutton-${idx}`}
                  onClick={() => openFileMenu(idx)}>
                  <MenuIconHorizontal />
                </div>
                <div
                  id={`component-files-filescontainer-inner-div-menu-${idx}`}
                  className="component-files-filescontainer-inner-div-menu">
                  <div className="component-files-filescontainer-inner-div-menu-div">
                    <button
                      onClick={() =>
                        openDeleteConfirmationMenu(
                          file.name,
                          file.isDirectory,
                          file.dirPath,
                          idx
                        )
                      }
                      className="component-files-filescontainer-inner-div-menu-div-button">
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        openRenamingMenu(
                          file.name,
                          file.isDirectory,
                          file.dirPath,
                          idx
                        )
                      }
                      className="component-files-filescontainer-inner-div-menu-div-button">
                      Rename
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div
          id={`component-files-delete-confirmation`}
          className="component-files-delete-confirmation">
          <div className="component-files-delete-confirmation-inner">
            <p
              style={{
                userSelect: "none",
                color: "#ffffff",
                fontSize: "20px",
                maxWidth: "400px",
              }}>
              Are you sure you want to delete the{" "}
              {confirmationFile[1] ? "directory" : "file"} '
              {confirmationFile[0]}'{" "}
              {confirmationFile[1] ? "and all the contents inside" : ""}{" "}
              <b>permanently</b>?
            </p>
            <div className="component-files-delete-confirmation-inner-buttons-div">
              <button
                onClick={() =>
                  openDeleteConfirmationMenu(null, null, null, null)
                }
                className="component-files-filescontainer-inner-div-menu-div-button">
                No
              </button>
              <button
                onClick={deleteDirectory}
                className="component-files-filescontainer-inner-div-menu-div-button">
                Yes
              </button>
            </div>
          </div>
        </div>
        <div id={`component-files-rename`} className="component-files-rename">
          <div className="component-files-rename-inner">
            <p
              style={{
                userSelect: "none",
                color: "#ffffff",
                fontSize: "20px",
                maxWidth: "400px",
              }}>
              Renaming the {renamingFile[1] ? "directory" : "file"} '
              {renamingFile[0]}' in the directory {renamingFile[2]}
            </p>
            <div className="component-files-rename-inner-buttons-div">
              <input
                className="component-files-rename-inner-buttons-div-input"
                id="component-files-rename-inner-buttons-div-input"
                placeholder={renamingFile[0]}
              />
            </div>
            <div className="component-files-rename-inner-buttons-div">
              <button
                onClick={() => openRenamingMenu(null, null, null, null)}
                className="component-files-filescontainer-inner-div-menu-div-button">
                Back
              </button>
              <button
                onClick={renameDirectory}
                className="component-files-filescontainer-inner-div-menu-div-button">
                Confirm
              </button>
            </div>
          </div>
        </div>
        <div className="component-files-filescontainer-info">
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              Uptime
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {uptime}
            </p>
          </div>
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              CPU Load
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {cpu}% / 100.0%
            </p>
          </div>
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              Disk
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {diskUsed} / {diskTotal}
            </p>
          </div>
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              Memory
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {ramUsed} / {ramTotal}
            </p>
          </div>
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              Network (Inbound)
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {inBound}
            </p>
          </div>
          <div className="component-files-filescontainer-info-div">
            <p className="component-files-filescontainer-info-div-title">
              Network (Outbound)
            </p>
            <p className="component-files-filescontainer-info-div-p">
              {outBound}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileContainer;
