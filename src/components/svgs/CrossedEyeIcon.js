function CrossedEyeIcon({ isInput, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      onClick={() => onClick()}
      style={{
        position: isInput ? "absolute" : "",
        right: "1rem",
        cursor: "pointer",
      }}
      width="28"
      height="28"
      role="img"
      aria-label="Hide password">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="#ffffff" />
      <circle cx="12" cy="12" r="4" fill="#000000" />
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="0.8"
      />
      <path
        d="M4 4 L20 20"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CrossedEyeIcon;
