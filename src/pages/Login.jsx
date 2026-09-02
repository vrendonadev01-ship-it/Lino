import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">

      <div className="auth-background">
        <div className="auth-glow auth-glow-one"></div>
        <div className="auth-glow auth-glow-two"></div>
      </div>

      <div className="auth-container">

        <section className="auth-showcase">

          <div className="auth-brand">
            <div className="auth-brand-logo">
              L
            </div>

            <span>
              lino
            </span>
          </div>

          <div className="auth-showcase-content">

            <p className="auth-tag">
              TU COLEGIO. TU ESPACIO.
            </p>

            <h1>
              Conoce a la comunidad
              <br />
              en <span>Lino.</span>
            </h1>

            <p>
              Comparte momentos, descubre personas,
              publica lo que quieras y conecta con
              tu comunidad escolar.
            </p>

          </div>

          <div className="auth-showcase-footer">
            <span>✦</span>
            Una comunidad hecha para ustedes.
          </div>

        </section>


        <section className="auth-form-section">

          <div className="auth-card">

            <div className="auth-card-header">

              <div className="auth-mobile-logo">
                L
              </div>

              <h2>
                Bienvenido
              </h2>

              <p>
                Inicia sesión para entrar a Lino.
              </p>

            </div>


            <form onSubmit={handleLogin}>

              <div className="auth-input-group">

                <label>
                  Correo electrónico
                </label>

                <div className="auth-input-wrapper">

                  <span>✉</span>

                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              <div className="auth-input-group">

                <label>
                  Contraseña
                </label>

                <div className="auth-input-wrapper">

                  <span>⌑</span>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Entrando..."
                  : "Iniciar sesión"}
              </button>

            </form>


            <div className="auth-divider">
              <span></span>
              <p>o continúa con</p>
              <span></span>
            </div>


            <button
              className="google-button"
              type="button"
              onClick={() =>
                alert(
                  "El inicio con Google lo configuraremos después."
                )
              }
            >
              <span className="google-icon">
                G
              </span>

              Continuar con Google
            </button>


            <div className="auth-bottom">

              <span>
                ¿No tienes una cuenta?
              </span>

              <button onClick={onRegister}>
                Crear cuenta
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;