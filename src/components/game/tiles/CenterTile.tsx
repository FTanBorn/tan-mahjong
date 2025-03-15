// components/game/tiles/CenterTile.tsx
import React from "react";
import { Box, Zoom } from "@mui/material";
import { Tile } from "@/types/gameTypes";
import { getTileBackground, renderTile } from "@/utils/gameUtils";
import { pulse } from "@/utils/animations";

interface CenterTileProps {
  centerTile: Tile;
}

const CenterTile: React.FC<CenterTileProps> = ({ centerTile }) => {
  return (
    <Zoom in={true} timeout={500}>
      <Box
        sx={{
          width: { xs: 100, sm: 110, md: 120 },
          height: { xs: 100, sm: 110, md: 120 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          perspective: "1000px",
        }}
      >
        {/* Mahjong taşı alt gölge */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "90px", sm: "100px", md: "110px" },
            height: { xs: "90px", sm: "100px", md: "110px" },
            backgroundColor: "#000",
            borderRadius: "8px",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            opacity: 0.6,
            zIndex: 1,
          }}
        />

        {/* Mahjong taşı ana gövde - merkez */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "70px", sm: "80px", md: "90px" },
            height: { xs: "70px", sm: "80px", md: "90px" },
            backgroundColor: getTileBackground(centerTile),
            borderRadius: "8px",
            border: "2px solid rgba(0,0,0,0.3)",
            boxSizing: "border-box",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.5)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${getTileBackground(
              centerTile
            )}, rgba(255,255,255,0.4))`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              pointerEvents: "none",
            },
            animation: `${pulse} 2s infinite`,
          }}
        >
          {/* İç içerik - altın çerçeve */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "55px", sm: "65px", md: "75px" },
              height: { xs: "55px", sm: "65px", md: "75px" },
              borderRadius: "6px",
              border: "2px solid gold",
              backgroundColor: "rgba(255,255,255,0.2)",
              boxShadow:
                "inset 0 0 10px rgba(255,215,0,0.5), 0 0 15px rgba(255,215,0,0.3)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "scale(1.5)",
              }}
            >
              {renderTile(centerTile)}
            </Box>
          </Box>
        </Box>

        {/* Altın parıltı efekti */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "120px", sm: "135px", md: "150px" },
            height: { xs: "120px", sm: "135px", md: "150px" },
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%)",
            animation: `${pulse} 2s infinite alternate`,
            zIndex: 0,
          }}
        />
      </Box>
    </Zoom>
  );
};

export default CenterTile;
