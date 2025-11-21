function ButtonComponent({
  buttonName,
  onClick,
  width,
  fontSize,
  borderRadius,
  border,
}) {
  return (
    <button
      className="global-component-button"
      onClick={onClick}
      style={{
        width: width,
        fontSize: fontSize,
        borderRadius: borderRadius,
        border: border,
      }}>
      {buttonName || "undefined"}
    </button>
  );
}

export default ButtonComponent;
