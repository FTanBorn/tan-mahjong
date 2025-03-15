// hooks/useGameLogic.tsx
import { useState, useEffect, useRef } from "react";
import {
  Tile,
  Player,
  GamePhase,
  MoveReference,
  ActiveTile,
  TeamType,
  TEAMS,
} from "@/types/gameTypes";
import {
  addProperties,
  shuffleTiles,
  canPlaceTileOn,
  determineNextPlayerByTileTeam,
  debugMatrices,
} from "@/utils/gameUtils";

const useGameLogic = () => {
  // Oyun durumu state'leri
  const [gamePhase, setGamePhase] = useState<GamePhase>("teamSelection");
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

  // Animasyon için state'ler
  const [activeTile, setActiveTile] = useState<ActiveTile | null>(null);
  const [lastPlaced, setLastPlaced] = useState<ActiveTile | null>(null);

  // useRef kullanarak son hamle bilgilerini saklayacağız
  const lastMoveRef = useRef<MoveReference>({
    matrix: null,
    playerIndex: 0,
    completed: true,
  });

  // Oyunu başlat
  const initializeGame = () => {
    const { firstMatrix, secondMatrix, randomPlayerIndex } = shuffleTiles();

    setFirstMatrix(firstMatrix);
    setSecondMatrix(secondMatrix);

    // Oyuna rastgele bir oyuncuyla başla
    setCurrentPlayerIndex(randomPlayerIndex);
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[0].canPlay = randomPlayerIndex === 0;
      newPlayers[1].canPlay = randomPlayerIndex === 1;
      return newPlayers;
    });
    setGameMessage(`Takım belirlemek için bir sütun seçin.`);
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

    initializeGame();
  };

  // Kazanma durumunu kontrol et
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

    // Animasyon için aktif taşı ayarla
    setActiveTile({ row: rowIndex, matrix: playerIndex });

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

    // Hamleden sonra animasyon göster
    setLastPlaced({ row: rowIndex, matrix: playerIndex });

    // 500ms sonra animasyonu kaldır
    setTimeout(() => {
      setActiveTile(null);
      setLastPlaced(null);
    }, 1500);

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
          const nextPlayerIndex = determineNextPlayerByTileTeam(
            newTileTeam,
            newPlayers
          );

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
          debugMatrices(firstMatrix, secondMatrix, newPlayers);

          return newPlayers;
        });
      }
    }, 600);
  };

  // Oyun aşamasına bağlı olarak taş seçimini işle
  const handleTileSelection = (
    matrix: Tile[][],
    rowIndex: number,
    playerIndex: number
  ) => {
    const matrixSetter = playerIndex === 0 ? setFirstMatrix : setSecondMatrix;

    if (gamePhase === "teamSelection") {
      selectTeam(matrix, matrixSetter, rowIndex, playerIndex);
    } else {
      playTurn(matrix, matrixSetter, rowIndex, playerIndex);
    }
  };

  // Oyunu başlat
  useEffect(() => {
    initializeGame();
  }, []);

  return {
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
  };
};

export default useGameLogic;
