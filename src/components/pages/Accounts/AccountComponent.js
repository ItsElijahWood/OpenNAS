import Button from "../../global/Button";
import { useState, useEffect } from "react";
import CheckMark from "../../svgs/checkMark";
import XIcon from "../../svgs/XIcon";
import PencilIcon from "../../svgs/PencilIcon";

function AccountComponent() {
  const [uid, setUid] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ uid: "", fs: [], mnt: [] });

  useEffect(() => {
    async function authUser() {
      const response = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        window.location.href = "/";
      } else {
        const data = await response.json();

        setUid(data.uid);
      }
    }

    authUser();
  }, []);

  useEffect(() => {
    if (!uid && uid !== 0) return;

    async function getAccountInfo() {
      const response = await fetch("/accounts/info", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid })
      });

      if (response.ok) {
        const data = await response.json();

        setAccounts([data.data]);
      }
    }

    getAccountInfo();
  }, [uid]);

  async function createNewAccount() {
    const renderDiv = document.getElementById("component-account-create-account");

    if (!renderDiv) return;

    const fetchDisk = await fetch('/accounts/get-drives', {
      method: "GET"
    });
    const getHighestUID = await fetch('/global/get-highest-id', {
      method: "GET"
    });
    const dataDisk = await fetchDisk.json();
    const dataHighestUID = await getHighestUID.json();

    const newId = dataHighestUID.uid + 1;

    setNewAccount({ uid: newId, fs: dataDisk.driveArray, mnt: dataDisk.mntArray });

    renderDiv.style.display = "table-row";
  };

  function closeNewAccount() {
    const renderDiv = document.getElementById("component-account-create-account");
    const usernameInput = document.getElementById("component-account-username-new-account");
    const descriptionInput = document.getElementById("component-account-reason-new-account");
    const passwordInput = document.getElementById("component-account-password-new-account");

    if (!renderDiv) return;

    usernameInput.value = "";
    passwordInput.value = "";
    descriptionInput.value = "";
    renderDiv.style.display = "none";
  };

  return (
    <>
      <div className="component-account-container">
        <div className="component-account-container-0">
          <p className="component-account-container-title">Accounts</p>
          <Button buttonName="New Account" onClick={createNewAccount} width={200} />
        </div>
        <div style={{ marginTop: "50px" }}>
          <table className="account-table">
            <thead>
              <tr>
                <th className="tooltip-accounts" data-info="Modify the account">Modify</th>
                <th className="tooltip-accounts" data-info="The accounts username">Username</th>
                <th className="tooltip-accounts" data-info="Unique user ID assigned to the account">UID</th>
                <th className="tooltip-accounts" data-info="Whether this is a built-in system account">Builtin</th>
                <th className="tooltip-accounts" data-info="What access or privileges this user has (User, Admin)">Access</th>
                <th className="tooltip-accounts" data-info="The password of the account">Password</th>
                <th className="tooltip-accounts" data-info="Short description of the account">Description</th>
                <th className="tooltip-accounts" data-info="Where this user is mounted (filesystem path)">Mnt Point</th>
                <th className="tooltip-accounts" data-info="Disk associated with the user">Disk</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index}>
                  <td style={{ display: "flex", justifyContent: "center" }}>
                    <PencilIcon width="30px" color="rgb(226, 114, 91)" height="30px" />
                  </td>
                  <td>{account.username}</td>
                  <td>{account.id}</td>
                  <td>{account.builtin}</td>
                  <td>{account.access}</td>
                  <td>{account.hidden_password}</td>
                  <td>{account.reason}</td>
                  <td>{account.mnt_point}</td>
                  <td>{account.drive}</td>
                </tr>
              ))}
              <tr id="component-account-create-account">
                <td style={{ display: "flex", borderTop: "none", padding: "16px", width: "auto" }}>
                  <CheckMark width="30px" color="rgb(226, 114, 91)" height="30px" />
                  <XIcon width="30px" color="rgb(226, 114, 91)" height="30px" onClick={closeNewAccount} />
                </td>
                <td>
                  <input placeholder="Username" className="component-account-new-account-input" id="component-account-username-new-account" type="text" />
                </td>
                <td>
                  <input className="component-account-new-account-input" style={{ cursor: "not-allowed" }} id="component-account-uid-new-account" type="text" value={newAccount.uid} readOnly />
                </td>
                <td>
                  <input className="component-account-new-account-input" style={{ cursor: "not-allowed" }} id="component-account-builtin-new-account" type="text" value="No" readOnly />
                </td>
                <td>
                  <select id="component-account-new-account-access" className="component-account-new-account-access">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td>
                  <input placeholder="Password" className="component-account-new-account-input" id="component-account-password-new-account" type="text" />
                </td>
                <td>
                  <input placeholder="Description" className="component-account-new-account-input" id="component-account-reason-new-account" type="text" />
                </td>
                <td>
                  <select id="component-account-new-account-mnt" className="component-account-new-account-mnt">
                    {newAccount.mnt.map((acc, idx) => (
                      <option key={idx} value={acc.mnt}>{acc.mnt}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select id="component-account-new-account-fs" className="component-account-new-account-fs">
                    {newAccount.fs.map((acc, idx) => (
                      <option key={idx} value={acc.fs}>{acc.fs}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AccountComponent;
