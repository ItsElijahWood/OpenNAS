export function BinIcon({ color, title, cursor, width, height }) {
  return (
    <svg
      style={{ color: color, width: width, cursor: cursor, height: height }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <title>{title}</title>
      <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1z" />
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
      <path d="M10 11h2v8h-2zM14 11h2v8h-2z" />
    </svg>
  )
}

export default BinIcon;

