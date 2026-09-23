import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthLayout } from "./AuthLayout";
import { setAuthHeader } from "../services/http";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.5 }}>
        Ingresar
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontFamily: "Georgia, 'Times New Roman', serif", mb: 1 }}
      >
        Hola de <em>nuevo</em>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Tus notas y categorías están donde las dejaste.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Usuario
        </Typography>
        <TextField
          required
          fullWidth
          size="small"
          placeholder="tu-usuario"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Contraseña
        </Typography>
        <TextField
          required
          fullWidth
          size="small"
          placeholder="Tu contraseña"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar/ocultar contraseña"
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Ingresar"}
        </Button>

        <Typography variant="body2" align="center" color="text.secondary">
          ¿Todavía no tienes cuenta?{" "}
          <Link component={RouterLink} to="/register" sx={{ fontWeight: 700 }}>
            Créala
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
