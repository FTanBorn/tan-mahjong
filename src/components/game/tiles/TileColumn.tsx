// components/game/tiles/TileColumn.tsx
import React from "react";
import { Stack, Button } from "@mui/material";
import { Tile, ActiveTile } from "@/types/gameTypes";
import GameTile from "./GameTile";
import { TEAMS } from "@/types/gameTypes";

interface TileColumnProps {
  matrix: Tile[][];
  rowIndex: number;
  matrixIndex: number;
  playerIndex: number;
  activeTile: ActiveTile | null;
  lastPlaced: ActiveTile | null;
  isDisabled: boolean;
  playerTeam: string;
  onTileSelection: (
    matrix: Tile[][],
    rowIndex: number,
    playerIndex: number
  ) => void;
  reverse?: boolean;
}

const TileColumn: React.FC<TileColumnProps> = ({
  matrix,
  rowIndex,
  matrixIndex,
  playerIndex,
  activeTile,
  lastPlaced,
  isDisabled,
  playerTeam,
  onTileSelection,
  reverse = false,
}) => {
  const row = matrix[rowIndex];

  // Koy butonu render etme fonksiyonu
  const renderPlaceButton = () => {
    return (
      <Button
        variant="contained"
        onClick={() => onTileSelection(matrix, rowIndex, playerIndex)}
        disabled={isDisabled}
        sx={{
          background: isDisabled
            ? "rgba(0,0,0,0.2)"
            : playerTeam === TEAMS.ANIMAL
            ? "#388e3c"
            : "#1976d2",
          borderRadius: "6px",
          fontWeight: "bold",
          padding: { xs: "4px 8px", sm: "5px 10px", md: "6px 12px" },
          minWidth: { xs: "auto", sm: "auto", md: "auto" },
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            background: playerTeam === TEAMS.ANIMAL ? "#2e7d32" : "#1565c0",
          },
          "&:disabled": {
            background: "rgba(0,0,0,0.2)",
          },
        }}
      >
        Koy
      </Button>
    );
  };

  return (
    <Stack direction={reverse ? "column-reverse" : "column"} spacing={1}>
      {renderPlaceButton()}

      {row.map((tile, tileIndex) => (
        <GameTile
          key={tileIndex}
          tile={tile}
          tileIndex={tileIndex}
          rowIndex={rowIndex}
          matrixIndex={matrixIndex}
          activeTile={activeTile}
          lastPlaced={lastPlaced}
          size={matrixIndex === 0 ? "small" : "medium"}
        />
      ))}
    </Stack>
  );
};

export default TileColumn;
