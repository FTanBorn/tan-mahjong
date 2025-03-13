// --------------------- app/page.tsx ---------------------
"use client";

import * as React from "react";
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  keyframes,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Link from "next/link"; // Yeni import satırı

// Animasyon efektleri
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(25, 118, 210, 0);
  }
  
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const glow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export default function HomePage() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 128px)", // Navbar ve padding için ayarlama
        textAlign: "center",
        py: 5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: "transparent",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.1) 100%)",
          padding: { xs: 4, md: 8 },
          borderRadius: 8,
          width: "100%",
          maxWidth: 800,
          mb: 5,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #1976d2, #304ffe, #2196f3)",
            backgroundSize: "200% 200%",
            animation: `${glow} 5s ease infinite`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
          }}
        >
          Oyun Dünyasına Hoş Geldiniz
        </Typography>

        <Typography variant="h6" sx={{ mb: 5, color: "text.secondary" }}>
          Heyecan verici oyun deneyimi için hemen başlayın
        </Typography>

        {/* Link bileşeni ile butonu sarmalayarak /game sayfasına yönlendirme ekledik */}
        <Link href="/game" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SportsEsportsIcon />}
            sx={{
              py: 1.5,
              px: 5,
              fontSize: "1.25rem",
              borderRadius: 100,
              textTransform: "none",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              boxShadow: "0 8px 20px rgba(33, 150, 243, 0.3)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              animation: `${pulse} 2s infinite`,
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 20px rgba(33, 150, 243, 0.4)",
                background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
              },
              "&:active": {
                transform: "translateY(1px)",
              },
            }}
          >
            OYNA
          </Button>
        </Link>

        <Box sx={{ mt: 8 }}>
          <Typography variant="body2" color="text.secondary">
            En yeni oyun içerikleri ve özel teklifler için üye olun
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
