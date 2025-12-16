function XIcon({ onClick, color, width, height }) {
  return (
    <svg onClick={onClick} style={{ width: width, height: height, color: color, userSelect: "none", cursor: "pointer" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5z" />
    </svg>
  );
}

export default XIcon;
