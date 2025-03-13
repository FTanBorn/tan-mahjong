"use client";

import React, { useEffect, useState } from "react";
import { socialTiles, animalTiles, getIcon } from "@/lib/game/tiles";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";

// Takım türlerini tanımla
const TEAMS = {
  UNDEFINED: "undefined",
  ANIMAL: "animal",
  SOCIAL: "social",
};

const GameBoard: React.FC = () => {
  // Taş türleri ve görünürlük ekle
  const addProperties = (tiles: any, type: any) => {
    return tiles.map((tile: any) => ({
      ...tile,
      isVisible: false,
      tileType: type, // Tür "animal" veya "social" olabilir
    }));
  };

  const [gamePhase, setGamePhase] = useState("teamSelection"); // "teamSelection" veya "gameplay"
  const [firstMatrix, setFirstMatrix] = useState<any[]>([]);
  const [secondMatrix, setSecondMatrix] = useState<any[]>([]);
  const [centerTile, setCenterTile] = useState({
    type: "empty",
    value: "jocker",
    isVisible: true,
    tileType: "neutral",
  });

  const [players, setPlayers] = useState([
    {
      name: "Player 1",
      canPlay: true,
      team: TEAMS.UNDEFINED,
      lastTileTeam: TEAMS.UNDEFINED,
    },
    {
      name: "Player 2",
      canPlay: false,
      team: TEAMS.UNDEFINED,
      lastTileTeam: TEAMS.UNDEFINED,
    },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameMessage, setGameMessage] = useState(
    "Takım belirlemek için bir sütun seçin."
  );

  const shuffleArray = () => {
    // Taş türleri ve görünürlük ekle
    const processedSocialTiles = addProperties(socialTiles, TEAMS.SOCIAL);
    const processedAnimalTiles = addProperties(animalTiles, TEAMS.ANIMAL);

    const combinedTiles = [...processedSocialTiles, ...processedAnimalTiles];
    const shuffledTiles = combinedTiles.sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffledTiles.length / 2);
    const firstHalf = shuffledTiles.slice(0, half);
    const secondHalf = shuffledTiles.slice(half);

    const createMatrix = (arr: any[]) => {
      const matrix = [];
      for (let i = 0; i < 6; i++) {
        matrix.push(arr.slice(i * 4, i * 4 + 4));
      }
      return matrix;
    };

    setFirstMatrix(createMatrix(firstHalf));
    setSecondMatrix(createMatrix(secondHalf));
  };

  // Takım seçim aşaması
  const selectTeam = (
    matrix: any[],
    matrixSetter: React.Dispatch<React.SetStateAction<any[]>>,
    rowIndex: number,
    playerIndex: number
  ) => {
    matrixSetter((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      const row = [...newMatrix[rowIndex]];

      if (row.length < 4) return prevMatrix;

      // Merkez taşını üste yerleştir (column-reverse görüntülemede dizinin başlangıcı)
      row.unshift({ ...centerTile, isVisible: true });

      // Alt taşı al (dizideki son eleman)
      const bottomTile = { ...row.pop(), isVisible: true };

      // Bu taşı yeni merkez olarak ayarla
      setCenterTile(bottomTile);

      newMatrix[rowIndex] = row;
      return newMatrix;
    });

    // Oyuncunun takımını merkez taşa göre güncelle
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      const tileTeam = centerTile.tileType;

      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        team: tileTeam,
        canPlay: false,
      };

      // Sonraki oyuncuya veya oyun aşamasına geç
      if (playerIndex === 0) {
        // İlk oyuncu takımını seçti, şimdi ikinci oyuncunun sırası
        newPlayers[1].canPlay = true;
        setGameMessage(
          `${players[1].name}, takım belirlemek için bir sütun seçin.`
        );
        setCurrentPlayerIndex(1);
      } else {
        // İki oyuncu da takımlarını seçti, oyun aşamasına geç
        setGamePhase("gameplay");
        // ANIMAL takımındaki ilk oyuncu başlar
        const animalPlayerIndex = newPlayers.findIndex(
          (p) => p.team === TEAMS.ANIMAL
        );
        if (animalPlayerIndex !== -1) {
          newPlayers[animalPlayerIndex].canPlay = true;
          newPlayers[1 - animalPlayerIndex].canPlay = false;
          setCurrentPlayerIndex(animalPlayerIndex);
        } else {
          // Hayvan takımı yoksa yedek çözüm (dengeli taşlarla olmamalı)
          newPlayers[0].canPlay = true;
          setCurrentPlayerIndex(0);
        }
        setGameMessage(
          `${newPlayers[currentPlayerIndex].name}'in sırası (${newPlayers[currentPlayerIndex].team} takımı).`
        );
      }

      return newPlayers;
    });
  };

  // Oyun aşaması
  const playTurn = (
    matrix: any[],
    matrixSetter: React.Dispatch<React.SetStateAction<any[]>>,
    rowIndex: number,
    playerIndex: number
  ) => {
    // Oyuncunun kendi takım taşlarını oynayıp oynamadığını kontrol et
    const selectedColumn = matrix[rowIndex];
    const topTile = selectedColumn[0]; // Seçilen sütunun üst taşı

    if (topTile.tileType !== players[playerIndex].team && topTile.isVisible) {
      setGameMessage(
        `Sadece kendi takım taşlarınızı (${players[playerIndex].team}) oynayabilirsiniz!`
      );
      return;
    }

    matrixSetter((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      const row = [...newMatrix[rowIndex]];

      if (row.length < 4) return prevMatrix;

      // Merkez taşını üste yerleştir
      row.unshift({ ...centerTile, isVisible: true });

      // Alt taşı al
      const bottomTile = { ...row.pop(), isVisible: true };

      // Bu taşı yeni merkez olarak ayarla
      setCenterTile(bottomTile);

      newMatrix[rowIndex] = row;
      return newMatrix;
    });

    // Oyuncunun son taşını ve sırasını güncelle
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      const tileTeam = centerTile.tileType;

      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        lastTileTeam: tileTeam,
      };

      // Sonraki sırayı belirle
      if (tileTeam === newPlayers[playerIndex].team) {
        // Aynı takım taşı - oyuncu devam eder
        setGameMessage(`Kendi takım taşınızı aldınız. Tekrar oynayın!`);
      } else {
        // Diğer takımın taşı - oyuncu değiştir
        const nextPlayerIndex = 1 - playerIndex;
        newPlayers[playerIndex].canPlay = false;
        newPlayers[nextPlayerIndex].canPlay = true;
        setCurrentPlayerIndex(nextPlayerIndex);
        setGameMessage(
          `${newPlayers[nextPlayerIndex].name}'in sırası (${newPlayers[nextPlayerIndex].team} takımı).`
        );
      }

      return newPlayers;
    });
  };

  // Oyun aşamasına bağlı olarak taş seçimini işle
  const handleTileSelection = (
    matrix: any[],
    matrixSetter: React.Dispatch<React.SetStateAction<any[]>>,
    rowIndex: number,
    playerIndex: number
  ) => {
    if (gamePhase === "teamSelection") {
      selectTeam(matrix, matrixSetter, rowIndex, playerIndex);
    } else {
      playTurn(matrix, matrixSetter, rowIndex, playerIndex);
    }
  };

  useEffect(() => {
    shuffleArray();
  }, []);

  // Görünürlüğe bağlı olarak taşı göster
  const renderTile = (tile: any) => {
    if (tile.isVisible) {
      return getIcon(tile.value);
    } else {
      return "?"; // Görünmez taşlar için soru işareti göster
    }
  };

  // Takıma göre taşlar için arka plan rengi al
  const getTileBackground = (tile: any) => {
    if (!tile.isVisible) return "lightgray";

    switch (tile.tileType) {
      case TEAMS.ANIMAL:
        return "lightgreen";
      case TEAMS.SOCIAL:
        return "lightblue";
      default:
        return "white";
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {gamePhase === "teamSelection" ? "Takım Belirleme" : "Oyun"}
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
        <Typography variant="h6">{gameMessage}</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          {players.map((player, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                border:
                  currentPlayerIndex === index
                    ? "2px solid #f50057"
                    : "1px solid #ddd",
                borderRadius: 1,
              }}
            >
              <Typography>
                {player.name}:{" "}
                {player.team !== TEAMS.UNDEFINED
                  ? `${
                      player.team === TEAMS.ANIMAL
                        ? "🐻 Hayvanlar"
                        : "🚗 Arabalar"
                    } Takımı`
                  : "Takım belirlenmedi"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Stack justifyContent={"center"} alignItems={"center"} spacing={6}>
        <Stack direction={"row"} spacing={2} justifyContent={"center"}>
          {firstMatrix.map((row, rowIndex) => (
            <Stack key={rowIndex} direction={"column-reverse"} spacing={2}>
              <Button
                variant="contained"
                onClick={() =>
                  handleTileSelection(firstMatrix, setFirstMatrix, rowIndex, 0)
                }
                disabled={!players[0].canPlay}
              >
                Koy
              </Button>
              {row.map((tile: any, tileIndex: any) => (
                <Box
                  key={tileIndex}
                  sx={{
                    width: "75px",
                    height: "75px",
                    backgroundColor: getTileBackground(tile),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #ccc",
                  }}
                >
                  {renderTile(tile)}
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>

        <Box
          sx={{
            width: "100px",
            height: "100px",
            backgroundColor: getTileBackground(centerTile),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #333",
            borderRadius: "8px",
            fontSize: "1.5rem",
          }}
        >
          {renderTile(centerTile)}
        </Box>

        <Stack direction={"row"} spacing={2} justifyContent={"center"}>
          {secondMatrix.map((row, rowIndex) => (
            <Stack key={rowIndex} direction={"column"} spacing={2}>
              <Button
                variant="contained"
                onClick={() =>
                  handleTileSelection(
                    secondMatrix,
                    setSecondMatrix,
                    rowIndex,
                    1
                  )
                }
                disabled={!players[1].canPlay}
              >
                Koy
              </Button>

              {row.map((tile: any, tileIndex: any) => (
                <Box
                  key={tileIndex}
                  sx={{
                    width: "75px",
                    height: "75px",
                    backgroundColor: getTileBackground(tile),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #ccc",
                  }}
                >
                  {renderTile(tile)}
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </div>
  );
};

export default GameBoard;
