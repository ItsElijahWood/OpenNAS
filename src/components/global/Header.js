import opennas_logo from "../../styles/imgs/OpenNASS.png";

function HeaderComponent() {
  const onClickTitle = () => {
    window.location.href = "/nas";
  }

  return (
    <div className="global-component-header">
      <div className="global-component-header-titlediv" onClick={onClickTitle}>
        <img src={opennas_logo} style={{ userSelect: "none" }} width={28} height={28} alt="OpenNAS Logo"></img>
        <p style={{ color: "#ffffff", fontSize: "20px", userSelect: "none" }}>Open<b style={{ color: "#e2725b" }}>NAS</b></p>
      </div>
    </div>
  )
}

export default HeaderComponent;
