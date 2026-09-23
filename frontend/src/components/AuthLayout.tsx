import type { ReactNode } from "react";
import Box from "@mui/material/Box";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: { xs: 3, sm: 6 },
        py: 6,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 380, mx: "auto" }}>{children}</Box>
    </Box>
  );
}
