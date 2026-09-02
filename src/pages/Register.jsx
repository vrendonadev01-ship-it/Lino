import { useState } from "react";
import { supabase } from "../lib/supabase";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            name,
            username,
          },
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessage(
        "Cuenta creada. Revisa tu correo para confirmar tu cuenta."
      );
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
              ÚNETE A LA COMUNIDAD
            </p>

            <h1>
              Tu colegio,
              <br />
              <span>tu gente.</span>
            </h1>

            <p>
              Crea tu perfil, comparte momentos,
              encuentra a tus compañeros y descubre
              lo que está pasando en Campus.
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
                C
              </div>

              <h2>
                Crear cuenta
              </h2>

              <p>
                Crea tu cuenta para comenzar.
              </p>

            </div>


            <form onSubmit={handleRegister}>

              <div className="auth-input-row">

                <div className="auth-input-group">

                  <label>
                    Nombre
                  </label>

                  <div className="auth-input-wrapper">

                    <span>◉</span>

                    <input
                      type="text"
                      placeholder="Victor"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                <div className="auth-input-group">

                  <label>
                    Usuario
                  </label>

                  <div className="auth-input-wrapper">

                    <span>@</span>

                    <input
                      type="text"
                      placeholder="victor"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>

              </div>


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
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    minLength={6}
                    required
                  />

                </div>

              </div>


              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              {message && (
                <div className="auth-success">
                  {message}
                </div>
              )}


              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creando cuenta..."
                  : "Crear cuenta"}
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
                  "El registro con Google lo configuraremos después."
                )
              }
            >

              <span className="google-icon">
                G
              </span>

              Registrarse con Google

            </button>


            <div className="auth-bottom">

              <span>
                ¿Ya tienes una cuenta?
              </span>

              <button onClick={onLogin}>
                Iniciar sesión
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Register;