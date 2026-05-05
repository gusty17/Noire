import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import PasswordStrength from "../../components/Auth/PasswordStrength";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Must contain uppercase letter";
    }

    if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Must contain a number";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      await register(form.fullName.trim(), form.email.trim(), form.password);
      
      setSuccess("Account created successfully! Redirecting to login...");
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        submit: err.response?.data?.message || err.message || "Registration failed"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>NOIRE</h1>

      <div className="auth-box">
        {/* TABS */}
        <div className="auth-tabs">
          <button onClick={() => navigate("/login")}>Sign In</button>
          <button className="active">Sign Up</button>
        </div>

        {/* SERVER ERROR */}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        {/* SUCCESS */}
        {success && <div className="success">{success}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input 
            name="fullName" 
            placeholder="Full Name" 
            value={form.fullName}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <input 
            name="email" 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <PasswordStrength password={form.password} />

          <button type="submit" className="submit-btn" disabled={loading || success}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;