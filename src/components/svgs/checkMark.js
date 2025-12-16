function CheckMark({ onClick, width, height, color }) {
  return (
    <svg onClick={() => onClick} style={{ width: width, height: height, color: color, userSelect: "none", cursor: "pointer" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M9 16.17 4.83 12 3.41 13.41 9 19l12-12L19.59 5.59z" />
    </svg>
  );
}

export default CheckMark;
