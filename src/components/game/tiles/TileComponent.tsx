// components/game/tiles/TileComponent.tsx
import React from "react";
import { Box, Paper } from "@mui/material";
import { Tile } from "@/types/gameTypes";
import { TEAMS } from "@/types/gameTypes";

interface TileComponentProps {
  tile: Tile;
  isDisabled: boolean;
  playerTeam: string;
}

const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  isDisabled,
  playerTeam,
}) => {
  const getBackgroundColor = () => {
    if (!tile.isVisible) return "#424242";
    if (tile.tileType === TEAMS.ANIMAL) return "#388e3c";
    if (tile.tileType === TEAMS.SOCIAL) return "#1976d2";
    return "#9e9e9e";
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: 40, sm: 50, md: 60 },
        height: { xs: 60, sm: 75, md: 90 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getBackgroundColor(),
        color: "white",
        fontWeight: "bold",
        fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        opacity: isDisabled ? 0.7 : 1,
        "&:hover": {
          transform: isDisabled ? "none" : "translateY(-2px)",
          boxShadow: isDisabled
            ? "none"
            : "0 8px 16px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": tile.isVisible
            ? {
                content: '""',
                position: "absolute",
                top: 4,
                left: 4,
                right: 4,
                bottom: 4,
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: 1,
              }
            : {},
        }}
      >
        {tile.isVisible ? tile.value : "?"}
      </Box>
    </Paper>
  );
};

export default TileComponent;