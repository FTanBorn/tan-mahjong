// components/game/tiles/GameTile.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Tile, ActiveTile } from "@/types/gameTypes";
import { getTileBackground, renderTile } from "@/utils/gameUtils";
import { flip, bounce } from "@/utils/animations";

interface GameTileProps {
  tile: Tile;
  tileIndex: number;
  rowIndex: number;
  matrixIndex: number;
  activeTile: ActiveTile | null;
  lastPlaced: ActiveTile | null;
  size?: "small" | "medium" | "large";
}

const GameTile: React.FC<GameTileProps> = ({
  tile,
  tileIndex,
  rowIndex,
  matrixIndex,
  activeTile,
  lastPlaced,
  size = "medium",
}) => {
  // Boyut değerleri
  const sizeValues = {
    small: {
      width: { xs: 45, sm: 55, md: 65 },
      height: { xs: 45, sm: 55, md: 65 },
      innerWidth: { xs: 35, sm: 45, md: 55 },
      innerHeight: { xs: 35, sm: 45, md: 55 },
      fontSize: { xs: "20px", sm: "24px", md: "30px" },
      shadowWidth: { xs: "46px", sm: "56px", md: "66px" },
      shadowHeight: { xs: "46px", sm: "56px", md: "66px" },
      tileWidth: { xs: "50px", sm: "60px", md: "70px" },
      tileHeight: { xs: "50px", sm: "60px", md: "70px" },
    },
    medium: {
      width: { xs: 60, sm: 70, md: 80 },
      height: { xs: 60, sm: 70, md: 80 },
      innerWidth: { xs: 40, sm: 50, md: 60 },
      innerHeight: { xs: 40, sm: 50, md: 60 },
      fontSize: { xs: "20px", sm: "24px", md: "30px" },
      shadowWidth: { xs: "56px", sm: "66px", md: "76px" },
      shadowHeight: { xs: "56px", sm: "66px", md: "76px" },
      tileWidth: { xs: "50px", sm: "60px", md: "70px" },
      tileHeight: { xs: "50px", sm: "60px", md: "70px" },
    },
    large: {
      width: { xs: 70, sm: 80, md: 90 },
      height: { xs: 70, sm: 80, md: 90 },
      innerWidth: { xs: 50, sm: 60, md: 70 },
      innerHeight: { xs: 50, sm: 60, md: 70 },
      fontSize: { xs: "22px", sm: "26px", md: "32px" },
      shadowWidth: { xs: "66px", sm: "76px", md: "86px" },
      shadowHeight: { xs: "66px", sm: "76px", md: "86px" },
      tileWidth: { xs: "60px", sm: "70px", md: "80px" },
      tileHeight: { xs: "60px", sm: "70px", md: "80px" },
    },
  };

  // Boyuta göre değerleri al
  const dimensions = sizeValues[size];

  // Taşın etkin olup olmadığını kontrol et
  const isActive =
    activeTile &&
    activeTile.matrix === matrixIndex &&
    activeTile.row === rowIndex &&
    tileIndex === 0;

  // Taşın son yerleştirilmiş olup olmadığını kontrol et
  const isLastPlaced =
    lastPlaced &&
    lastPlaced.matrix === matrixIndex &&
    lastPlaced.row === rowIndex;

  // Taş için transform değeri
  const getTileTransform = () => {
    if (isActive) {
      // Taş hareket ediyor
      return matrixIndex === 0
        ? "scale(1.1) translateY(-10px)"
        : "scale(1.1) translateY(10px)";
    } else if (isLastPlaced) {
      // Son yerleştirilen taş
      return "scale(1.05)";
    }
    return "scale(1)";
  };

  // Taş için animasyon değeri
  const getTileAnimation = () => {
    if (isLastPlaced && tileIndex === 0) {
      return `${bounce} 1s ease`;
    } else if (!tile.isVisible && isLastPlaced && tileIndex === 0) {
      return `${flip} 0.6s ease-in-out`;
    }
    return "none";
  };

  return (
    <Box
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        transform: getTileTransform(),
        transition: "all 0.3s ease-in-out",
        animation: getTileAnimation(),
        perspective: "1000px",
        transformStyle: "preserve-3d",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {/* Mahjong taşı - gölge ve alt kısım */}
      <Box
        sx={{
          position: "absolute",
          width: dimensions.shadowWidth,
          height: dimensions.shadowHeight,
          backgroundColor: "#111",
          borderRadius: "6px",
          bottom: "-4px",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Mahjong taşı ana gövde */}
      <Box
        sx={{
          position: "relative",
          width: dimensions.tileWidth,
          height: dimensions.tileHeight,
          backgroundColor: !tile.isVisible
            ? "#d9d0c3"
            : getTileBackground(tile),
          borderRadius: "6px",
          border: "1px solid rgba(0,0,0,0.2)",
          boxSizing: "border-box",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0))",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            pointerEvents: "none",
          },
          transition: "all 0.5s ease",
          animation:
            !tile.isVisible && isLastPlaced && tileIndex === 0
              ? `${flip} 0.6s ease-in-out`
              : "none",
        }}
      >
        {/* İç içerik - simge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: dimensions.innerWidth,
            height: dimensions.innerHeight,
            borderRadius: "4px",
            backgroundColor: !tile.isVisible
              ? "#d9d0c3"
              : "rgba(255,255,255,0.2)",
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.2)",
            position: "relative",
            "&::after": !tile.isVisible
              ? {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "30px", sm: "35px", md: "40px" },
                  height: { xs: "20px", sm: "25px", md: "30px" },
                  backgroundImage:
                    "radial-gradient(circle, #a3927a 3px, transparent 4px)",
                  backgroundSize: "10px 10px",
                  backgroundRepeat: "repeat",
                  opacity: 0.5,
                }
              : {},
          }}
        >
          {tile.isVisible ? (
            renderTile(tile)
          ) : (
            <Typography
              sx={{
                fontSize: dimensions.fontSize,
                fontWeight: "bold",
                color: "#72665a",
              }}
            >
              ?
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GameTile;
