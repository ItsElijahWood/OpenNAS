function PencilIcon({ width, height, color, onClick, title, cursor }) {
  return (
    <svg onClick={onClick} style={{ width: width, height: height, color: color, userSelect: "none", cursor: cursor }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>{title}</title>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

export default PencilIcon;
