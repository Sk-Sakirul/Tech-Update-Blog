export default function Button({ children, type = 'button', className = '', disabled = false, onClick }) {
  return (
    <button type={type} className={`btn ${className}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
