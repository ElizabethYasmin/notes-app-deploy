import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";

interface AuthLayoutProps {
  children: ReactNode;
}

const FEATURES = [
  {
    icon: <CategoryOutlinedIcon />,
    title: "Categorías",
    description: "Organiza tus notas por tema y filtra en un click.",
  },
  {
    icon: <SyncOutlinedIcon />,
    title: "Tiempo real",
    description: "Los cambios se sincronizan al instante entre tus sesiones abiertas.",
  },
  {
    icon: <LockPersonOutlinedIcon />,
    title: "Privado",
    description: "Cada cuenta tiene su propio espacio — nadie más ve tus notas.",
  },
  {
    icon: <ArchiveOutlinedIcon />,
    title: "Archivo",
    description: "Guarda lo que no necesitas ahora, sin perderlo de vista.",
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left: form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380, mx: "auto" }}>{children}</Box>
      </Box>

      {/* Right: feature showcase, hidden on small screens */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          px: 6,
          py: 6,
          color: "#fff",
          background: "linear-gradient(160deg, #1a2a52 0%, #2d1b52 100%)",
        }}
      >
        <Box sx={{ maxWidth: 420 }}>
          <Typography
            variant="overline"
            sx={{ opacity: 0.7, letterSpacing: 1.5 }}
          >
            Con tu cuenta
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              mb: 4,
              lineHeight: 1.2,
            }}
          >
            Organiza <em>tus</em> ideas
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {FEATURES.map((feature) => (
              <Box key={feature.title} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.12)",
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
