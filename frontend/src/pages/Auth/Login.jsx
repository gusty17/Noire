import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!form.email || !form.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Call login from AuthContext
      const response = await login(form.email, form.password);
      
      console.log("Login successful:", response);
      
      // Clear form and redirect to home
      setForm({ email: "", password: "" });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>NOIRE</h1>

      <div className="auth-box">
        {/*  TOP TABS */}
        <div className="auth-tabs">
          <button className="active">Sign In</button>
          <button onClick={() => navigate("/register")}>Sign Up</button>
        </div>

        {/* ERROR MESSAGE */}
        {error && <div className="error-message">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input 
            name="email" 
            type="email"
            placeholder="Email" 
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;