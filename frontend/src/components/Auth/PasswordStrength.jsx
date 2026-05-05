function PasswordStrength({ password }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return (
    <div className="password-strength">
      <p className={checks.length ? "valid" : ""}>
        • At least 8 characters
      </p>
      <p className={checks.uppercase ? "valid" : ""}>
        • Contains uppercase letter
      </p>
      <p className={checks.number ? "valid" : ""}>
        • Contains a number
      </p>
    </div>
  );
}

export default PasswordStrength;