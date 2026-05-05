import "./Button.css";

function Button({ children, variant = "primary", onClick, type = "button", disabled = false }) {
  return (
    <button className={`btn btn-${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
