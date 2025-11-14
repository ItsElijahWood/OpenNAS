import naslogo_icon from "../styles/imgs/OpenNAS.png";
import "../styles/css/404.css";

function FourZeroFour() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
        alignItems: "center",
        color: "#ffffff",
        userSelect: "none",
      }}>
      <img
        src={naslogo_icon}
        onClick={() => (window.location.href = "/")}
        className="fourzerofour-logo"
        width={128}
        height={200}
      />
      <p style={{ fontSize: "30px", marginTop: "60px" }}>
        Page not found, have you tried turning it off and on again?
      </p>
      <h1 style={{ fontSize: "70px", margin: "0" }}>404</h1>
    </div>
  );
}

export default FourZeroFour;
