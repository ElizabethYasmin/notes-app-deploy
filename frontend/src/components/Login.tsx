import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthHeader } from "../services/http";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const testHeader = "Basic " + btoa(`${username}:${password}`);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
      headers: { Authorization: testHeader },
    });

    if (res.ok) {
      setAuthHeader(username, password);
      navigate("/notes");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="page-title">📝 Mis Notas</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Ingresar
        </button>
        <p className="login-subtitle">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
