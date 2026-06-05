import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock,
  FaPhone, FaArrowRight, FaShoppingBag, FaCheckCircle,
} from "react-icons/fa";
import "./Auth.css"

const AuthStyles = () => (
  <style>{`
    
  `}</style>
);

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  return score; // 0-3
}

const strengthLabel  = ["", "Weak", "Medium", "Strong"];
const strengthColors = ["", "filled-weak", "filled-medium", "filled-strong"];

/* ─── Field Component ─────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, type = "text", placeholder, value, onChange, error, delay = 0, name }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="field-group" style={{ animationDelay: `${delay}ms` }}>
      <label className="field-label">{label}</label>
      <div className="field-input-wrap">
        <Icon className="field-icon" size={13} />
        <input
          name={name}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`field-input${isPassword ? " has-right" : ""}`}
          autoComplete={isPassword ? "current-password" : undefined}
        />
        {isPassword && (
          <button type="button" className="eye-btn" onClick={() => setShow((s) => !s)} tabIndex={-1}>
            {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
          </button>
        )}
      </div>
      {error && <p className="field-error">⚠ {error}</p>}
    </div>
  );
}

function StrengthMeter({ password }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: -8, marginBottom: 12 }}>
      <div className="strength-bar-wrap">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`strength-bar ${i <= strength ? strengthColors[strength] : ""}`}
          />
        ))}
      </div>
      <p className={`strength-label ${strength === 1 ? "text-red-400" : strength === 2 ? "text-yellow-400" : "text-green-400"}`}>
        {strengthLabel[strength]}
      </p>
    </div>
  );
}

const features = [
  { icon: FaShoppingBag,    title: "Exclusive Member Deals",    desc: "Unlock early access to sales and member-only pricing." },
  { icon: FaCheckCircle,    title: "Order Tracking",            desc: "Follow every step of your delivery in real time."       },
  { icon: FaCheckCircle,    title: "Easy Returns",              desc: "Hassle-free returns within 30 days, no questions asked."},
  { icon: FaUser,           title: "Saved Addresses & Wishlist",desc: "Shop faster with saved preferences and wishlists."      },
];

const Auth = () => {
  const { user, login, register, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState("login");   // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Register form state
  const [regData, setRegData] = useState({ name: "", email: "", password: "", phone: "" });
  const [regErrors, setRegErrors] = useState({});

  // Redirect if already logged in
  if (!authLoading && user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/"} replace />;
  }

  /* ── Validation ── */
  const validateLogin = () => {
    const errs = {};
    if (!loginData.email.trim())                  errs.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errs.email = "Enter a valid email";
    if (!loginData.password)                      errs.password = "Password is required";
    return errs;
  };

  const validateRegister = () => {
    const errs = {};
    if (!regData.name.trim())                     errs.name     = "Full name is required";
    if (!regData.email.trim())                    errs.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(regData.email)) errs.email   = "Enter a valid email";
    if (!regData.password)                        errs.password = "Password is required";
    else if (regData.password.length < 6)         errs.password = "Minimum 6 characters";
    if (regData.phone && !/^\d{10}$/.test(regData.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-digit phone";
    return errs;
  };

  /* ── Handlers ── */
 const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError(""); setSuccess("");
  const errs = validateLogin();
  if (Object.keys(errs).length) { setLoginErrors(errs); return; }
  setLoginErrors({});
  setLoading(true);
  try {
  const loggedInUser = await login({ email: loginData.email, password: loginData.password });
  setSuccess("Welcome back! Redirecting…");
  navigate(loggedInUser?.role === "admin" ? "/dashboard" : "/", { replace: true }); //  no setTimeout, use replace
} catch (err) {
  setError(err?.response?.data?.message || "Invalid email or password.");
} finally {
    setLoading(false);
  }
};

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const errs = validateRegister();
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({});
    setLoading(true);
    try {
      await register({ name: regData.name, email: regData.email, password: regData.password, phone: regData.phone });
      setSuccess("Account created! Welcome aboard 🎉 Redirecting…");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError(""); setSuccess("");
    setLoginErrors({}); setRegErrors({});
  };

  return (
    <>
      <AuthStyles />
      <div className="auth-root">
        {/* Orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        {/* ── LEFT PANEL ── */}
        <div className="auth-panel-left">
          <div style={{ marginBottom: 12 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 140, marginBottom: 32 }} />
          </div>
          <h2 className="auth-display-title">
            Fashion that<br />
            fits your <em>life.</em>
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
            Join thousands of members who shop smarter — with personalised recommendations, seamless checkout, and fast delivery.
          </p>
          <div>
            {features.map((f, i) => (
              <div key={f.title} className="auth-feature" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                <div className="auth-feature-icon"><f.icon size={13} /></div>
                <div className="auth-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-panel-right">
          <div className="auth-card">

            {/* Logo (mobile only) */}
            <div style={{ textAlign: "center", marginBottom: 24 }} className="lg:hidden">
              <img src="/logo.png" alt="Logo" style={{ width: 120, margin: "0 auto" }} />
            </div>

            {/* Greeting */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
                {mode === "login" ? "Welcome back" : "Create account"}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                {mode === "login"
                  ? "Sign in to access your orders, wishlist & more."
                  : "Start your fashion journey — it's free forever."}
              </p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "login" ? "active" : ""}`}    onClick={() => switchMode("login")}>Sign In</button>
              <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => switchMode("register")}>Register</button>
            </div>

            {/* Alert */}
            {error   && <div className="auth-alert error">  <span>✕</span>{error}  </div>}
            {success && <div className="auth-alert success"><FaCheckCircle size={13} />{success}</div>}

            {/* ── LOGIN FORM ── */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="form-slide-in-left" noValidate>
                <Field
                  label="Email Address" name="email" icon={FaEnvelope}
                  type="email" placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  error={loginErrors.email} delay={0}
                />
                <Field
                  label="Password" name="password" icon={FaLock}
                  type="password" placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  error={loginErrors.password} delay={60}
                />
                <div style={{ textAlign: "right", marginBottom: 16, marginTop: -6 }}>
                  <span style={{ color: "#a5b4fc", fontSize: "0.78rem", cursor: "pointer", fontWeight: 500 }}>
                    Forgot password?
                  </span>
                </div>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <><div className="spin" />Signing in…</> : <>Sign In <FaArrowRight size={12} /></>}
                </button>
                <p style={{ textAlign: "center", color: "#475569", fontSize: "0.78rem", marginTop: 20 }}>
                  No account?{" "}
                  <span style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }} onClick={() => switchMode("register")}>
                    Create one free →
                  </span>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {mode === "register" && (
              <form onSubmit={handleRegisterSubmit} className="form-slide-in" noValidate>
                <Field
                  label="Full Name" name="name" icon={FaUser}
                  placeholder="John Doe"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  error={regErrors.name} delay={0}
                />
                <Field
                  label="Email Address" name="email" icon={FaEnvelope}
                  type="email" placeholder="you@example.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  error={regErrors.email} delay={60}
                />
                <Field
                  label="Password" name="password" icon={FaLock}
                  type="password" placeholder="Min. 6 characters"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  error={regErrors.password} delay={120}
                />
                <StrengthMeter password={regData.password} />
                <Field
                  label="Phone (optional)" name="phone" icon={FaPhone}
                  type="tel" placeholder="10-digit mobile"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  error={regErrors.phone} delay={180}
                />
                <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? <><div className="spin" />Creating account…</> : <>Create Account <FaArrowRight size={12} /></>}
                </button>
                <p style={{ textAlign: "center", color: "#475569", fontSize: "0.75rem", marginTop: 16, lineHeight: 1.6 }}>
                  By registering you agree to our{" "}
                  <span style={{ color: "#a5b4fc", cursor: "pointer" }}>Terms</span> &{" "}
                  <span style={{ color: "#a5b4fc", cursor: "pointer" }}>Privacy Policy</span>.
                </p>
                <p style={{ textAlign: "center", color: "#475569", fontSize: "0.78rem", marginTop: 8 }}>
                  Already have an account?{" "}
                  <span style={{ color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }} onClick={() => switchMode("login")}>
                    Sign in →
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;