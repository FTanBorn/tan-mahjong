// components/game/PlayerInfo.tsx
import React from "react";
import { Paper, Stack, Avatar, Typography, Chip } from "@mui/material";
import { Player } from "@/types/gameTypes";
import { TEAMS } from "@/types/gameTypes";
import { pulse } from "@/utils/animations";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import ShareIcon from "@mui/icons-material/Share";

interface PlayerInfoProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  players,
  currentPlayerIndex,
}) => {
  // Takımı temsil eden simgeyi getir
  const getTeamIcon = (team: string) => {
    switch (team) {
      case TEAMS.ANIMAL:
        return <EmojiNatureIcon />;
      case TEAMS.SOCIAL:
        return <ShareIcon />;
      default:
        return <SportsEsportsIcon />;
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        px: { xs: 2, sm: 5, md: 10 },
        zIndex: 5,
      }}
    >
      {players.map((player, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            p: 1,
            borderRadius: "8px",
            width: { xs: "45%", sm: "40%", md: "30%" },
            border:
              currentPlayerIndex === index
                ? `3px solid ${
                    player.team === TEAMS.ANIMAL ? "#388e3c" : "#1976d2"
                  }`
                : "1px solid #ddd",
            background:
              currentPlayerIndex === index
                ? `linear-gradient(45deg, ${
                    player.team === TEAMS.ANIMAL
                      ? "rgba(56,142,60,0.1)"
                      : "rgba(25,118,210,0.1)"
                  }, transparent)`
                : "rgba(255,255,255,0.8)",
            boxShadow:
              currentPlayerIndex === index
                ? "0 4px 20px rgba(0,0,0,0.15)"
                : "0 2px 10px rgba(0,0,0,0.1)",
            animation:
              currentPlayerIndex === index ? `${pulse} 2s infinite` : "none",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                bgcolor:
                  player.team === TEAMS.ANIMAL
                    ? "#388e3c"
                    : player.team === TEAMS.SOCIAL
                    ? "#1976d2"
                    : "grey",
                width: 32,
                height: 32,
              }}
            >
              {getTeamIcon(player.team)}
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              {player.name}
            </Typography>
            <Chip
              size="small"
              label={
                player.team !== TEAMS.UNDEFINED
                  ? `${player.team === TEAMS.ANIMAL ? "🐻" : "🚗"}`
                  : "?"
              }
              color={
                player.team === TEAMS.ANIMAL
                  ? "success"
                  : player.team === TEAMS.SOCIAL
                  ? "primary"
                  : "default"
              }
              sx={{ height: 24, minWidth: 24, fontWeight: "bold" }}
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default PlayerInfo;
