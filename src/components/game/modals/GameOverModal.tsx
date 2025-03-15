// components/game/modals/GameOverModal.tsx
import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Player } from "@/types/gameTypes";
import { TEAMS } from "@/types/gameTypes";
import { glowingWin } from "@/utils/animations";

interface GameOverModalProps {
  isOpen: boolean;
  gameWinner: number | null;
  players: Player[];
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  gameWinner,
  players,
  onRestart,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => {}}
      aria-labelledby="game-over-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          border:
            gameWinner !== null
              ? `5px solid ${
                  players[gameWinner].team === TEAMS.ANIMAL
                    ? "#388e3c"
                    : "#1976d2"
                }`
              : "5px solid #888",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          p: 4,
          textAlign: "center",
          animation: `${glowingWin} 2s infinite alternate`,
        }}
      >
        <StarIcon sx={{ fontSize: 60, color: "gold", mb: 2 }} />
        <Typography
          id="game-over-modal-title"
          variant="h4"
          fontWeight="bold"
          mb={2}
        >
          Oyun Bitti!
        </Typography>
        <Typography variant="h5" mb={3}>
          {gameWinner !== null
            ? `${players[gameWinner].name} (${
                players[gameWinner].team === TEAMS.ANIMAL
                  ? "Hayvanlar"
                  : "Sosyal"
              } Takımı) kazandı!`
            : "Oyun berabere bitti!"}
        </Typography>
        <Button
          onClick={onRestart}
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            fontSize: "1.2rem",
            borderRadius: "50px",
            background: "linear-gradient(45deg, #2196f3, #1565c0)",
            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.4)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976d2, #0d47a1)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(33, 150, 243, 0.5)",
            },
          }}
        >
          Yeniden Başlat
        </Button>
      </Box>
    </Modal>
  );
};

export default GameOverModal;
