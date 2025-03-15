"use client";

import React, { useEffect, useState, useRef } from "react";
import { socialTiles, animalTiles, getIcon } from "@/lib/game/tiles";
import { Box, Button, Stack, Typography, Paper, Modal } from "@mui/material";

// Takım türlerini tanımla
const TEAMS = {
  UNDEFINED: "undefined",
  ANIMAL: "animal",
  SOCIAL: "social",
};

// Taş tipi tanımlaması
interface Tile {
  type: string;
  value: string;
  isVisible: boolean;
  tileType: string;
  isCollected?: boolean;
}

// Oyuncu tipi tanımlaması
interface Player {
  name: string;
  canPlay: boolean;
  team: string;
  lastTileTeam: string;
  collectedTiles: Tile[];
}

const GameBoard: React.FC = () => {
  // Taş türleri ve görünürlük ekle
  const addProperties = (tiles: any, type: string): Tile[] => {
    return tiles.map((tile: any) => ({
      ...tile,
      isVisible: false,
      tileType: type, // Tür "animal" veya "social" olabilir
      isCollected: false, // Oyuncu tarafından toplanıp toplanmadığı
    }));
  };

  const [gamePhase, setGamePhase] = useState<"teamSelection" | "gameplay">(
    "teamSelection"
  );
  const [firstMatrix, setFirstMatrix] = useState<Tile[][]>([]);
  const [secondMatrix, setSecondMatrix] = useState<Tile[][]>([]);
  const [centerTile, setCenterTile] = useState<Tile>({
    type: "empty",
    value: "jocker",
    isVisible: true,
    tileType: "neutral",
  });

  const [players, setPlayers] = useState<Player[]>([
    {
      name: "Oyuncu 1",
      canPlay: true,
      team: TEAMS.UNDEFINED,
      lastTileTeam: TEAMS.UNDEFINED,
      collectedTiles: [],
    },
    {
      name: "Oyuncu 2",
      canPlay: false,
      team: TEAMS.UNDEFINED,
      lastTileTeam: TEAMS.UNDEFINED,
      collectedTiles: [],
    },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>(
    "Takım belirlemek için bir sütun seçin."
  );
  const [gameWinner, setGameWinner] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // useRef kullanarak son hamle bilgilerini saklayacağız
  const lastMoveRef = useRef<{
    matrix: Tile[][] | null;
    playerIndex: number;
    completed: boolean;
  }>({
    matrix: null,
    playerIndex: 0,
    completed: true,
  });

  // Matrisleri karıştır ve yerleştir
  const shuffleArray = () => {
    // Taş türleri ve görünürlük ekle
    const processedSocialTiles = addProperties(socialTiles, TEAMS.SOCIAL);
    const processedAnimalTiles = addProperties(animalTiles, TEAMS.ANIMAL);

    const combinedTiles = [...processedSocialTiles, ...processedAnimalTiles];
    const shuffledTiles = combinedTiles.sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffledTiles.length / 2);
    const firstHalf = shuffledTiles.slice(0, half);
    const secondHalf = shuffledTiles.slice(half);

    const createMatrix = (arr: Tile[]): Tile[][] => {
      const matrix: Tile[][] = [];
      for (let i = 0; i < 6; i++) {
        matrix.push(arr.slice(i * 4, i * 4 + 4));
      }
      return matrix;
    };

    setFirstMatrix(createMatrix(firstHalf));
    setSecondMatrix(createMatrix(secondHalf));

    // Oyuna rastgele bir oyuncuyla başla
    const randomPlayerIndex = Math.floor(Math.random() * 2);
    setCurrentPlayerIndex(randomPlayerIndex);
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[0].canPlay = randomPlayerIndex === 0;
      newPlayers[1].canPlay = randomPlayerIndex === 1;
      return newPlayers;
    });
    setGameMessage(
      `${players[randomPlayerIndex].name}, takım belirlemek için bir sütun seçin.`
    );
  };

  // Hamle sonrası kazanma durumunu kontrol et
  const checkWinCondition = () => {
    if (gamePhase === "teamSelection" || isGameOver) return;

    // Son hamleyi yapan oyuncunun indeksi
    const playerIndex = lastMoveRef.current.playerIndex;

    // Kontrol edilecek matris
    const matrix = playerIndex === 0 ? firstMatrix : secondMatrix;
    const playerTeam = players[playerIndex].team;

    // Takım belirlenmemişse kontrol etme
    if (playerTeam === TEAMS.UNDEFINED) return;

    let allTilesAreTeam = true;
    let allTilesVisible = true;
    let hasJoker = false;

    // Matristeki tüm taşları kontrol et
    for (const column of matrix) {
      for (const tile of column) {
        // Tüm taşlar oyuncunun takımından mı?
        if (tile.tileType !== playerTeam) {
          allTilesAreTeam = false;
        }

        // Tüm taşlar görünür mü?
        if (!tile.isVisible) {
          allTilesVisible = false;
        }

        // Joker var mı?
        if (tile.value === "jocker" && tile.type === "empty") {
          hasJoker = true;
        }
      }
    }

    console.log(`--- OYUNCU ${playerIndex + 1} KAZANMA KONTROLÜ ---`);
    console.log(`Oyuncu ${playerIndex + 1} (Takım ${playerTeam}):`);
    console.log(`- Tüm taşlar takımdan mı: ${allTilesAreTeam}`);
    console.log(`- Tüm taşlar görünür mü: ${allTilesVisible}`);
    console.log(`- Joker var mı: ${hasJoker}`);

    // Kazanma koşulu: Tüm taşlar takımdan + hepsi görünür + joker yok
    if (allTilesAreTeam && allTilesVisible && !hasJoker) {
      console.log(`Oyuncu ${playerIndex + 1} kazandı!`);
      setGameWinner(playerIndex);
      setIsGameOver(true);
      setGameMessage(`${players[playerIndex].name} oyunu kazandı!`);
    }
  };

  // Matrislerde değişiklik olduğunda kazanma kontrolü yap
  useEffect(() => {
    if (lastMoveRef.current.completed === false) {
      checkWinCondition();
      lastMoveRef.current.completed = true;
    }
  }, [firstMatrix, secondMatrix]);

  // Hamle öncesi kazanma potansiyelini değerlendir
  const evaluateWinPotential = (
    matrix: Tile[][],
    playerIndex: number,
    rowIndex: number
  ): boolean => {
    // Oyuncu takımını al
    const playerTeam = players[playerIndex].team;

    // Kolon içinden merkeze gelecek taşı bul (en sondaki taş)
    const column = [...matrix[rowIndex]];
    if (column.length === 0) return false;

    const bottomTile = column[column.length - 1];

    // Geçici bir matris oluştur ve hamleyi simüle et
    const tempMatrix = matrix.map((col) => [...col]);

    // Seçilen sütunda hamleyi simüle et
    tempMatrix[rowIndex] = [...tempMatrix[rowIndex]];
    if (tempMatrix[rowIndex].length > 0) {
      // Merkez taşını üste ekle
      tempMatrix[rowIndex].unshift({ ...centerTile, isVisible: true });
      // Son taşı kaldır (ortaya gelecek)
      tempMatrix[rowIndex].pop();
    }

    // Simüle edilmiş matristeki durumu kontrol et
    let allTeamTiles = true;
    let allVisible = true;
    let noJoker = true;

    for (const col of tempMatrix) {
      for (const tile of col) {
        if (tile.tileType !== playerTeam) allTeamTiles = false;
        if (!tile.isVisible) allVisible = false;
        if (tile.value === "jocker" && tile.type === "empty") noJoker = false;
      }
    }

    // Eğer merkeze gelecek taş oyuncunun kendi takımındansa
    if (bottomTile.tileType === playerTeam) {
      // Kazanma potansiyeli: Simüle matristeki tüm taşlar takımdan ve görünür, joker yok
      return allTeamTiles && allVisible && noJoker;
    }

    return false;
  };

  // Takım seçim aşaması
  const selectTeam = (
    matrix: Tile[][],
    matrixSetter: React.Dispatch<React.SetStateAction<Tile[][]>>,
    rowIndex: number,
    playerIndex: number
  ) => {
    let newBottomTile: Tile | null = null;

    matrixSetter((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      const row = [...newMatrix[rowIndex]];

      if (row.length < 4) return prevMatrix;

      // Merkez taşını üste yerleştir
      row.unshift({ ...centerTile, isVisible: true });

      // Alt taşı al
      const bottomTile = { ...row.pop()!, isVisible: true };

      // Bu taşı dışarıya referans olarak kaydet
      newBottomTile = bottomTile;

      // Bu taşı yeni merkez olarak ayarla
      setCenterTile(bottomTile);

      newMatrix[rowIndex] = row;
      return newMatrix;
    });

    // Her iki oyuncunun takımlarını merkez taşa göre güncelle
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];

      // İçeride değişkeni kullanamayacağımız için yeni gelen taşın takımını al
      const newTileTeam = newBottomTile?.tileType || TEAMS.UNDEFINED;

      // Merkeze gelen taş hangi takımdansa, hamleyi yapan oyuncu o takıma atanır
      newPlayers[playerIndex].team = newTileTeam;

      // Diğer oyuncu karşı takıma atanır
      newPlayers[1 - playerIndex].team =
        newTileTeam === TEAMS.ANIMAL ? TEAMS.SOCIAL : TEAMS.ANIMAL;

      // Takımların belirlenmesi ile ilgili mesaj
      setGameMessage(
        `${newPlayers[playerIndex].name} ${
          newTileTeam === TEAMS.ANIMAL ? "Hayvanlar" : "Sosyal"
        } takımında, ${newPlayers[1 - playerIndex].name} ${
          newTileTeam === TEAMS.ANIMAL ? "Sosyal" : "Hayvanlar"
        } takımında. ${newPlayers[playerIndex].name} oynamaya devam ediyor.`
      );

      // Oyun aşamasına geç
      setGamePhase("gameplay");

      return newPlayers;
    });
  };

  // Bir taşın üstüne yerleştirilebilir olup olmadığını kontrol et
  const canPlaceTileOn = (topTile: Tile, selectedTile: Tile): boolean => {
    // Eğer üstteki taş görünür değilse (kapalıysa), her taş yerleştirilebilir
    if (!topTile.isVisible) return true;

    // Eğer üstteki taş joker ise, herhangi bir taş onun üzerine konulabilir
    if (topTile.value === "jocker") return true;

    // Merkezdeki joker taşı da her taşın üzerine konulabilir
    if (selectedTile.value === "jocker") return true;

    // Aynı değerde taşlar üst üste konulabilir
    return topTile.value === selectedTile.value;
  };

  // Ortaya çıkan taşın takımına göre sıradaki oyuncuyu belirle
  const determineNextPlayerByTileTeam = (tileTeam: string): number => {
    // Oyuncuların takımlarını kontrol et
    const playerWithMatchingTeam = players.findIndex(
      (player) => player.team === tileTeam
    );

    if (playerWithMatchingTeam !== -1) {
      return playerWithMatchingTeam;
    }

    // Eğer hiçbir oyuncu bu takımda değilse (olmaması gerekir ama güvenlik için)
    return currentPlayerIndex;
  };

  // Debug fonksiyonu - matrislerdeki taşları konsola yazdır
  const debugMatrices = () => {
    console.log("--- MATRİS KONTROL ---");
    console.log("Oyuncu 1 Takımı:", players[0].team);
    console.log("Oyuncu 2 Takımı:", players[1].team);

    // First Matrix (Oyuncu 1)
    let player1TeamCount = 0;
    let player1VisibleTeamCount = 0;

    firstMatrix.forEach((column) => {
      column.forEach((tile) => {
        if (tile.tileType === players[0].team) {
          player1TeamCount++;
          if (tile.isVisible) player1VisibleTeamCount++;
        }
      });
    });

    console.log(
      `Oyuncu 1 Takım Taşları: ${player1VisibleTeamCount}/${player1TeamCount}`
    );

    // Second Matrix (Oyuncu 2)
    let player2TeamCount = 0;
    let player2VisibleTeamCount = 0;

    secondMatrix.forEach((column) => {
      column.forEach((tile) => {
        if (tile.tileType === players[1].team) {
          player2TeamCount++;
          if (tile.isVisible) player2VisibleTeamCount++;
        }
      });
    });

    console.log(
      `Oyuncu 2 Takım Taşları: ${player2VisibleTeamCount}/${player2TeamCount}`
    );
  };

  // Oyun aşaması
  const playTurn = (
    matrix: Tile[][],
    matrixSetter: React.Dispatch<React.SetStateAction<Tile[][]>>,
    rowIndex: number,
    playerIndex: number
  ) => {
    // Eğer oyun zaten bitmişse hamle yaptırma
    if (isGameOver) return;

    // Oyuncunun kendi takım taşlarını oynayıp oynamadığını kontrol et
    const selectedColumn = matrix[rowIndex];

    if (selectedColumn.length < 1) return;

    const topTile = selectedColumn[0]; // Seçilen sütunun üst taşı

    // Sadece kendi takım taşlarını veya görünmeyen taşları veya joker taşlarını oynayabilir
    if (
      topTile.tileType !== players[playerIndex].team &&
      topTile.isVisible &&
      topTile.value !== "jocker"
    ) {
      setGameMessage(
        `Sadece kendi takım taşlarınızı (${
          players[playerIndex].team === TEAMS.ANIMAL ? "Hayvanlar" : "Sosyal"
        }) oynayabilirsiniz!`
      );
      return;
    }

    // Eğer merkezdeki taş joker değilse ve matriste merkezdeki taşla aynı değere sahip taşlar varsa
    // sadece o taşların olduğu kolonlara yerleştirilebilir
    if (centerTile.value !== "jocker") {
      const hasSameValueTileInMatrix = matrix.some((column) =>
        column.some((tile) => tile.isVisible && tile.value === centerTile.value)
      );

      if (hasSameValueTileInMatrix) {
        const selectedColumnHasSameValueTile = selectedColumn.some(
          (tile) => tile.isVisible && tile.value === centerTile.value
        );

        if (!selectedColumnHasSameValueTile) {
          setGameMessage(
            `Bu taş sadece aynı değere sahip taşların olduğu kolonlara yerleştirilebilir!`
          );
          return;
        }
      }
    }

    // Yerleştirilebilirlik kontrolü
    if (topTile.isVisible && !canPlaceTileOn(topTile, centerTile)) {
      setGameMessage(
        `Bu taş sadece aynı değerdeki taşların üzerine konabilir!`
      );
      return;
    }

    // Hamle öncesi kazanma potansiyelini değerlendir
    const willWinAfterMove = evaluateWinPotential(
      matrix,
      playerIndex,
      rowIndex
    );

    if (willWinAfterMove) {
      console.log(`Bu hamle sonrası Oyuncu ${playerIndex + 1} kazanacak!`);
    }

    // Yeni çekilecek taşı referans olarak tutmak için
    let newBottomTile: Tile | null = null;

    // Hamle başlıyor, referansı güncelle
    lastMoveRef.current = {
      matrix: playerIndex === 0 ? firstMatrix : secondMatrix,
      playerIndex,
      completed: false,
    };

    matrixSetter((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      const row = [...newMatrix[rowIndex]];

      if (row.length < 1) return prevMatrix;

      // Merkez taşını üste yerleştir
      row.unshift({ ...centerTile, isVisible: true });

      // Alt taşı al
      const bottomTile = { ...row.pop()!, isVisible: true };

      // Bu taşı dışarıya referans olarak kaydet
      newBottomTile = bottomTile;

      // Bu taşı yeni merkez olarak ayarla
      setCenterTile(bottomTile);

      newMatrix[rowIndex] = row;
      return newMatrix;
    });

    // Eğer hamle sonrası kazanacağını biliyorsak, hemen kazananı ilan et
    if (willWinAfterMove) {
      setGameWinner(playerIndex);
      setIsGameOver(true);
      setGameMessage(`${players[playerIndex].name} oyunu kazandı!`);
      return;
    }

    // Hamle tamamlandıktan sonra oyuncu değişimi ve diğer işlemler
    // useEffect'teki kazanma kontrolü tamamlanmışsa ve oyun bitmemişse devam et
    setTimeout(() => {
      if (!isGameOver) {
        setPlayers((prevPlayers) => {
          const newPlayers = [...prevPlayers];

          // Yeni merkeze gelen taşın takımını al
          const newTileTeam = newBottomTile?.tileType || centerTile.tileType;

          // Taşı toplayan oyuncunun bilgilerini güncelle
          newPlayers[playerIndex] = {
            ...newPlayers[playerIndex],
            lastTileTeam: newTileTeam,
          };

          // Taşın takımına göre sonraki oyuncuyu belirle
          const nextPlayerIndex = determineNextPlayerByTileTeam(newTileTeam);

          // Taşı uygun oyuncuya ekle (kendi takımından bir taş çektiyse)
          if (newBottomTile && newTileTeam === newPlayers[playerIndex].team) {
            // Eğer taş, oyuncunun kendi takımından ise ona ekle
            newPlayers[playerIndex].collectedTiles.push({ ...newBottomTile });
          }

          // Sırayı güncelle
          newPlayers[0].canPlay = nextPlayerIndex === 0;
          newPlayers[1].canPlay = nextPlayerIndex === 1;
          setCurrentPlayerIndex(nextPlayerIndex);

          // Mesajı güncelle
          setGameMessage(
            `Ortaya ${
              newTileTeam === TEAMS.ANIMAL ? "hayvan" : "sosyal"
            } taşı geldi. Sıra ${newPlayers[nextPlayerIndex].name}'da (${
              newTileTeam === TEAMS.ANIMAL ? "Hayvanlar" : "Sosyal"
            } takımı).`
          );

          // Debug için matrisleri yazdır
          debugMatrices();

          return newPlayers;
        });
      }
    }, 100);
  };

  // Oyun aşamasına bağlı olarak taş seçimini işle
  const handleTileSelection = (
    matrix: Tile[][],
    matrixSetter: React.Dispatch<React.SetStateAction<Tile[][]>>,
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
  const renderTile = (tile: Tile) => {
    if (tile.isVisible) {
      return getIcon(tile.value);
    } else {
      return "?"; // Görünmez taşlar için soru işareti göster
    }
  };

  // Takıma göre taşlar için arka plan rengi al
  const getTileBackground = (tile: Tile): string => {
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

  // Oyunu yeniden başlat
  const restartGame = () => {
    setGamePhase("teamSelection");
    setPlayers([
      {
        name: "Oyuncu 1",
        canPlay: true,
        team: TEAMS.UNDEFINED,
        lastTileTeam: TEAMS.UNDEFINED,
        collectedTiles: [],
      },
      {
        name: "Oyuncu 2",
        canPlay: false,
        team: TEAMS.UNDEFINED,
        lastTileTeam: TEAMS.UNDEFINED,
        collectedTiles: [],
      },
    ]);
    setCenterTile({
      type: "empty",
      value: "jocker",
      isVisible: true,
      tileType: "neutral",
    });
    setGameMessage("Takım belirlemek için bir sütun seçin.");
    setGameWinner(null);
    setIsGameOver(false);

    // Son hamle referansını da sıfırla
    lastMoveRef.current = {
      matrix: null,
      playerIndex: 0,
      completed: true,
    };

    shuffleArray();
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
                        : "🚗 Sosyal"
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
                disabled={!players[0].canPlay || isGameOver}
              >
                Koy
              </Button>
              {row.map((tile, tileIndex) => (
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
              {/* Buton, oyuncu oynayabilir ve oyun bitmemişse etkin */}
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
                disabled={!players[1].canPlay || isGameOver}
              >
                Koy
              </Button>

              {row.map((tile, tileIndex) => (
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

      {/* Oyun sonu modalı */}
      <Modal
        open={isGameOver}
        onClose={() => {}}
        aria-labelledby="game-over-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="game-over-modal-title" variant="h6" component="h2">
            Oyun Bitti!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {gameWinner !== null
              ? `${players[gameWinner].name} kazandı!`
              : "Oyun berabere bitti!"}
          </Typography>
          <Button onClick={restartGame} variant="contained" sx={{ mt: 2 }}>
            Yeniden Başlat
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GameBoard;
