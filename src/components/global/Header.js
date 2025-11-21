import { useRef, useState, useEffect } from "react";
import opennas_logo from "../../styles/imgs/OpenNAS.png";
import MenuIcon from "../svgs/MenuIcon";
import ButtonComponent from "./Button";

function HeaderComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const onClickTitle = () => {
    window.location.href = "/nas";
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="global-component-header">
      <div className="global-component-header-titlediv" onClick={onClickTitle}>
        <img
          src={opennas_logo}
          style={{ userSelect: "none" }}
          width={28}
          height={28}
          alt="OpenNAS Logo"
        />
        <p style={{ color: "#ffffff", fontSize: "20px", userSelect: "none" }}>
          Open<b style={{ color: "#e2725b" }}>NAS</b>
        </p>
      </div>
      <div
        ref={buttonRef}
        onClick={() => setMenuOpen((value) => !value)}
        style={{ marginRight: "1rem", cursor: "pointer" }}>
        <MenuIcon />
      </div>
      <div
        ref={menuRef}
        id="global-component-header-menu"
        className={`global-component-header-menu ${menuOpen ? "visible" : ""}`}>
        <div
          className="global-component-header-menu-div"
          onClick={() => (window.location.href = "/nas/files")}>
          <ButtonComponent buttonName="Files" width="100%" fontSize={18} />
        </div>
        <div className="global-component-header-menu-div">
          <ButtonComponent buttonName="Accounts" width="100%" fontSize={18} />
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;
