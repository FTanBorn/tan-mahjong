// utils/gameUtils.ts
import { socialTiles, animalTiles, getIcon } from "@/lib/game/tiles";
import { TEAMS, Tile, Player } from "@/types/gameTypes";

// Taş türleri ve görünürlük ekle
export const addProperties = (tiles: any, type: string): Tile[] => {
  return tiles.map((tile: any) => ({
    ...tile,
    isVisible: false,
    tileType: type, // Tür "animal" veya "social" olabilir
    isCollected: false, // Oyuncu tarafından toplanıp toplanmadığı
  }));
};

// Matrisleri karıştır ve yerleştir
export const shuffleTiles = () => {
  // Taş türleri ve görünürlük ekle
  const processedSocialTiles = addProperties(socialTiles, TEAMS.SOCIAL);
  const processedAnimalTiles = addProperties(animalTiles, TEAMS.ANIMAL);

  const combinedTiles = [...processedSocialTiles, ...processedAnimalTiles];
  const shuffledTiles = combinedTiles.sort(() => Math.random() - 0.5);
  const half = Math.ceil(shuffledTiles.length / 2);
  const firstHalf = shuffledTiles.slice(0, half);
  const secondHalf = shuffledTiles.slice(half);

  return {
    firstMatrix: createMatrix(firstHalf),
    secondMatrix: createMatrix(secondHalf),
    randomPlayerIndex: Math.floor(Math.random() * 2),
  };
};

// Kare matris oluştur (6x4)
export const createMatrix = (arr: Tile[]): Tile[][] => {
  const matrix: Tile[][] = [];
  for (let i = 0; i < 6; i++) {
    matrix.push(arr.slice(i * 4, i * 4 + 4));
  }
  return matrix;
};

// Takıma göre taşlar için arka plan rengi al
export const getTileBackground = (tile: Tile): string => {
  if (!tile.isVisible) return "#d9d0c3";

  switch (tile.tileType) {
    case TEAMS.ANIMAL:
      return "#a4e4a7"; // Biraz daha zengin bir hayvan takımı yeşili
    case TEAMS.SOCIAL:
      return "#a1cef8"; // Biraz daha zengin bir sosyal takım mavisi
    default:
      return "#f2e6d9"; // Mahjong taşı krem rengi
  }
};

// Görünürlüğe bağlı olarak taşı göster
export const renderTile = (tile: Tile) => {
  if (tile.isVisible) {
    return getIcon(tile.value);
  } else {
    return "?"; // Görünmez taşlar için soru işareti göster
  }
};

// Bir taşın üstüne yerleştirilebilir olup olmadığını kontrol et
export const canPlaceTileOn = (topTile: Tile, selectedTile: Tile): boolean => {
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
export const determineNextPlayerByTileTeam = (
  tileTeam: string,
  players: Player[]
): number => {
  // Oyuncuların takımlarını kontrol et
  const playerWithMatchingTeam = players.findIndex(
    (player) => player.team === tileTeam
  );

  if (playerWithMatchingTeam !== -1) {
    return playerWithMatchingTeam;
  }

  // Eğer hiçbir oyuncu bu takımda değilse (olmaması gerekir ama güvenlik için)
  return 0; // Varsayılan olarak ilk oyuncu
};

// Debug fonksiyonu - matrislerdeki taşları konsola yazdır
export const debugMatrices = (
  firstMatrix: Tile[][],
  secondMatrix: Tile[][],
  players: Player[]
) => {
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
