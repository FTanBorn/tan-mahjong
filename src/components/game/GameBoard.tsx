// components/game/GameBoard.tsx
"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import useGameLogic from "@/hooks/useGameLogic";

// Bileşenler
import PlayerInfo from "./PlayerInfo";
import GameMessage from "./GameMessage";
import TileColumn from "./tiles/TileColumn";
import CenterTile from "./tiles/CenterTile";
import GameOverModal from "./modals/GameOverModal";

const GameBoard: React.FC = () => {
  // Oyun mantığını useGameLogic hook'undan al
  const {
    gamePhase,
    firstMatrix,
    secondMatrix,
    centerTile,
    players,
    currentPlayerIndex,
    gameMessage,
    gameWinner,
    isGameOver,
    activeTile,
    lastPlaced,
    handleTileSelection,
    restartGame,
  } = useGameLogic();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "auto", // Scroll etmeye izin ver
        backgroundImage: 'url("/api/placeholder/1920/1080")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(13, 85, 16, 0.9)", // Koyu yeşil çuha rengi
          zIndex: -1,
        },
      }}
    >
      {/* Oyun Mesajı */}
      <GameMessage message={gameMessage} />

      {/* Oyuncu Bilgileri */}
      <PlayerInfo players={players} currentPlayerIndex={currentPlayerIndex} />

      {/* Ana Oyun Alanı */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mt: { xs: 10, sm: 8, md: 6 },
          minHeight: "fit-content",
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1, sm: 2, md: 3 },
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Üst Oyuncu Sırası */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              gap: 2,
              width: "100%",
              px: { xs: 1, sm: 2, md: 4 },
              maxWidth: "100vw",
            }}
          >
            {firstMatrix.map((row, rowIndex) => (
              <TileColumn
                key={rowIndex}
                matrix={firstMatrix}
                rowIndex={rowIndex}
                matrixIndex={0}
                playerIndex={0}
                activeTile={activeTile}
                lastPlaced={lastPlaced}
                isDisabled={!players[0].canPlay || isGameOver}
                playerTeam={players[0].team}
                onTileSelection={handleTileSelection}
                reverse={true}
              />
            ))}
          </Box>

          {/* Merkez Taşı */}
          <CenterTile centerTile={centerTile} />

          {/* Alt Oyuncu Sırası */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              gap: 2,
              width: "100%",
              px: { xs: 1, sm: 2, md: 4 },
              maxWidth: "100vw",
            }}
          >
            {secondMatrix.map((row, rowIndex) => (
              <TileColumn
                key={rowIndex}
                matrix={secondMatrix}
                rowIndex={rowIndex}
                matrixIndex={1}
                playerIndex={1}
                activeTile={activeTile}
                lastPlaced={lastPlaced}
                isDisabled={!players[1].canPlay || isGameOver}
                playerTeam={players[1].team}
                onTileSelection={handleTileSelection}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Oyun Sonu Modalı */}
      <GameOverModal
        isOpen={isGameOver}
        gameWinner={gameWinner}
        players={players}
        onRestart={restartGame}
      />
    </Box>
  );
};

export default GameBoard;
