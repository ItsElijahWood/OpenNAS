function ButtonComponent({ buttonName, onClick, width }) {
  return (
    <button
      className="global-component-button"
      onClick={onClick}
      style={{ width: width }}>
      {buttonName || "undefined"}
    </button>
  );
}

export default ButtonComponent;
