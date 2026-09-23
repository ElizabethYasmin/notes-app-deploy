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
import { authService } from "../services/authService";

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.5 }}>
        Crear cuenta
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontFamily: "Georgia, 'Times New Roman', serif", mb: 1 }}
      >
        Empieza a <em>anotar</em>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Tu propio espacio privado para notas y categorías.
      </Typography>

      {success ? (
        <Alert severity="success">¡Cuenta creada! Redirigiendo a iniciar sesión...</Alert>
      ) : (
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
            placeholder="Mínimo 6 caracteres"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
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

          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Confirmar contraseña
          </Typography>
          <TextField
            required
            fullWidth
            size="small"
            placeholder="Repite tu contraseña"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={22} color="inherit" /> : "Registrarme"}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            ¿Ya tienes cuenta?{" "}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 700 }}>
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      )}
    </AuthLayout>
  );
}
