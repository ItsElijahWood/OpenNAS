import { useEffect } from "react";
import HeaderComponent from "../components/global/Header";
import AccountComponent from "../components/pages/Accounts/AccountComponent";
import '../styles/css/Accounts.css';

function Accounts() {
  useEffect(() => {
    async function authUser() {
      const response = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        window.location.href = "/";
      }
    }

    authUser();
  }, []);

  return (
    <>
      <HeaderComponent />
      <AccountComponent />
    </>
  );
}

export default Accounts;
