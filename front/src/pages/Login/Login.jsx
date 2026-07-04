import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const colors = {
  forest: "#0C2D1E",
  forestMid: "#1B5C3A",
  gold: "#E8A020",
  goldLight: "#F5C040",
  coral: "#D45830",
  cream: "#FDF6EC",
  muted: "#5A7060",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (isAuthenticated) navigate("/mis-viajes", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = true;
    if (!pwd) newErrors.pwd = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email, pwd);
      navigate("/mis-viajes", { replace: true });
    } catch (err) {
      // el mensaje ya queda en authError
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: colors.cream }}>

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-left-bg" />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#fff" }}>
            Tip<span style={{ color: colors.gold }}>Plan</span>
          </div>

          <div className="login-left-main">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(232,160,32,0.18)",
                border: "1px solid rgba(232,160,32,0.38)",
                color: colors.gold,
                padding: "0.35rem 1rem",
                borderRadius: "50px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                marginBottom: "1.4rem",
                width: "fit-content",
              }}
            >
              ✦ Tu plataforma de viajes
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                fontWeight: 900,
                lineHeight: 1.06,
                color: "#fff",
                marginBottom: "1.2rem",
              }}
            >
              Vive tu próxima
              <br />
              <em style={{ color: colors.gold, fontStyle: "italic" }}>aventura</em>
              <br />
              sin límites
            </h1>
            <p
              style={{
                fontSize: "0.97rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                maxWidth: "380px",
                marginBottom: "2.5rem",
              }}
            >
              Planifica, organiza y descubre destinos increíbles en Ecuador y el mundo.
              Todo en un solo lugar, gratis para siempre.
            </p>
            <div style={{ display: "flex", gap: "2.5rem" }}>
              {[["50+", "Destinos"], ["12K+", "Viajeros"], ["100%", "Gratuito"]].map(([num, label]) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: colors.gold,
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.48)", marginTop: "0.2rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex" }}>
              {[["AM", colors.gold], ["LP", "#c0e0d0"], ["CV", "#a0c8b4"]].map(([initials, bg], i) => (
                <div
                  key={initials}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `2px solid ${colors.forest}`,
                    background: bg,
                    color: colors.forest,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: i < 2 ? -10 : 0,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>
              <strong style={{ color: "rgba(255,255,255,0.88)" }}>+12,000 viajeros</strong> ya planifican con TipPlan
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="login-right-blob-1" />
          <div className="login-right-blob-2" />
        </div>

        <div className="login-form-box">
          {/* Mobile logo */}
          <div
            className="login-mobile-logo"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 900,
              color: colors.forest,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Tip<span style={{ color: colors.gold }}>Plan</span>
          </div>

          <div style={{ marginBottom: "2.2rem" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: colors.forest,
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              Bienvenido de <em style={{ color: colors.coral, fontStyle: "italic" }}>vuelta</em> 👋
            </h2>
            <p style={{ fontSize: "0.9rem", color: colors.muted }}>
              ¿No tienes cuenta?{" "}
              <Link to="/registro" style={{ color: colors.forestMid, fontWeight: 700, textDecoration: "none" }}>
                Regístrate gratis
              </Link>
            </p>
          </div>

          {/* Social */}
          <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.6rem" }}>
            {[["🔵", "Google"], ["📘", "Facebook"]].map(([icon, label]) => (
              <button
                key={label}
                className="social-btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.55rem",
                  padding: "0.72rem",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(12,45,30,0.14)",
                  background: "#fff",
                  cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: colors.forest,
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{icon}</span> {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.6rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(12,45,30,0.1)" }} />
            <span style={{ fontSize: "0.78rem", color: "#aab8ae", whiteSpace: "nowrap" }}>
              o continúa con tu correo
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(12,45,30,0.1)" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.74rem",
                fontWeight: 700,
                color: colors.forest,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "0.45rem",
              }}
            >
              Correo electrónico
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.45, fontSize: "1rem" }}>
                ✉️
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                placeholder="tu@email.com"
                className="login-input"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.8rem",
                  borderRadius: "13px",
                  border: `1.5px solid ${errors.email ? colors.coral : "rgba(12,45,30,0.15)"}`,
                  background: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.92rem",
                  color: colors.forest,
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.forest)}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? colors.coral : "rgba(12,45,30,0.15)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.74rem",
                fontWeight: 700,
                color: colors.forest,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "0.45rem",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.45, fontSize: "1rem" }}>
                🔒
              </span>
              <input
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => { setPwd(e.target.value); clearError(); }}
                placeholder="••••••••"
                className="login-input"
                style={{
                  width: "100%",
                  padding: "0.85rem 2.8rem 0.85rem 2.8rem",
                  borderRadius: "13px",
                  border: `1.5px solid ${errors.pwd ? colors.coral : "rgba(12,45,30,0.15)"}`,
                  background: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.92rem",
                  color: colors.forest,
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.forest)}
                onBlur={(e) => (e.target.style.borderColor = errors.pwd ? colors.coral : "rgba(12,45,30,0.15)")}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  opacity: 0.4,
                }}
              >
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Remember / forgot */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.6rem", flexWrap: "wrap", gap: "0.6rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ display: "none" }} />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "5px",
                  border: `1.5px solid ${remember ? colors.forest : "rgba(12,45,30,0.22)"}`,
                  background: remember ? colors.forest : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {remember && <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: "0.84rem", color: colors.muted }}>Recuérdame</span>
            </label>
            <a href="#" style={{ fontSize: "0.84rem", color: colors.forestMid, fontWeight: 600, textDecoration: "none" }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {authError && (
            <div style={{
              background: "rgba(212,88,48,0.10)",
              border: `1.5px solid ${colors.coral}`,
              color: colors.coral,
              padding: "0.7rem 1rem",
              borderRadius: "12px",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: "1.1rem",
              textAlign: "center",
            }}>
              {authError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={submitting}
            className="login-submit-btn"
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "50px",
              background: colors.forest,
              color: "#fff",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1.4rem",
            }}
          >
            {submitting ? "Ingresando..." : "Iniciar sesión ✈"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeup {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-page {
          min-height: 100vh;
          display: flex;
        }

        /* LEFT PANEL */
        .login-left {
          display: flex;
          width: 55%;
          position: relative;
          overflow: hidden;
          animation: fadeup 0.8s ease both;
        }
        .login-left-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://tipplan.netlify.app/assets/image1-BGnmYZ2D.webp');
          background-size: cover;
          background-position: center;
          background-color: #0C2D1E;
        }
        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(8,20,16,0.92) 0%, rgba(12,45,30,0.72) 50%, rgba(0,0,0,0.3) 100%);
        }
        .login-left-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          padding: 2.5rem 3rem;
        }
        .login-left-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* RIGHT PANEL */
        .login-right {
          width: 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 3rem 1.5rem;
        }
        .login-right-blob-1 {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(232,160,32,0.07);
          pointer-events: none;
        }
        .login-right-blob-2 {
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(12,45,30,0.05);
          pointer-events: none;
        }
        .login-form-box {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
          animation: fadeup 0.6s ease both;
        }
        .login-mobile-logo {
          display: none;
        }

        .social-btn {
          transition: all .2s;
        }
        .social-btn:hover {
          border-color: ${colors.forest} !important;
          background: rgba(12,45,30,0.04) !important;
        }

        .login-input {
          transition: border-color .2s, box-shadow .2s;
        }

        .login-submit-btn {
          transition: all .22s;
        }
        .login-submit-btn:hover {
          background: ${colors.forestMid} !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(12,45,30,0.22);
        }

        /* RESPONSIVE: tablet/mobile */
        @media (max-width: 1024px) {
          .login-left {
            display: none;
          }
          .login-right {
            width: 100%;
          }
          .login-mobile-logo {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;