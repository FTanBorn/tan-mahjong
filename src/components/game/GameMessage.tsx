// components/game/GameMessage.tsx
import React from "react";
import { Box, Typography, Fade } from "@mui/material";

interface GameMessageProps {
  message: string;
}

const GameMessage: React.FC<GameMessageProps> = ({ message }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        maxWidth: "90%",
        width: "auto",
        p: 2,
        borderRadius: "10px",
        bgcolor: "rgba(0,0,0,0.5)",
        color: "white",
        textAlign: "center",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Fade in={true} timeout={800}>
        <Typography variant="h6" fontWeight="medium">
          {message}
        </Typography>
      </Fade>
    </Box>
  );
};

export default GameMessage;
