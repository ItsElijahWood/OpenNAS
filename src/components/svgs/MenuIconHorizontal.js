function MenuIconHorizontal() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      role="img"
      aria-label="More options"
      style={{
        position: "absolute",
        right: "20px",
        cursor: "pointer",
        top: "30%",
      }}
      xmlns="http://www.w3.org/2000/svg">
      <title>More options</title>
      <circle cx="6" cy="12" r="2" fill="white" />
      <circle cx="12" cy="12" r="2" fill="white" />
      <circle cx="18" cy="12" r="2" fill="white" />
    </svg>
  );
}

export default MenuIconHorizontal;
