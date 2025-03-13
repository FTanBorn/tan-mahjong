import { Icon } from "@iconify/react";

// Tile tipini tanımla
export interface Tile {
  type: string;
  value: string;
}

// socialTiles ve animalTiles dizilerini Tile tipiyle tanımla
export const socialTiles: Tile[] = [
  { type: "social", value: "discord" },
  { type: "social", value: "discord" },
  { type: "social", value: "discord" },
  { type: "social", value: "discord" },
  { type: "social", value: "linkedin" },
  { type: "social", value: "linkedin" },
  { type: "social", value: "linkedin" },
  { type: "social", value: "linkedin" },
  { type: "social", value: "x" },
  { type: "social", value: "x" },
  { type: "social", value: "x" },
  { type: "social", value: "x" },
  { type: "social", value: "github" },
  { type: "social", value: "github" },
  { type: "social", value: "github" },
  { type: "social", value: "github" },
  { type: "social", value: "facebook" },
  { type: "social", value: "facebook" },
  { type: "social", value: "facebook" },
  { type: "social", value: "facebook" },
  { type: "social", value: "youtube" },
  { type: "social", value: "youtube" },
  { type: "social", value: "youtube" },
  { type: "social", value: "youtube" },
];

export const animalTiles: Tile[] = [
  { type: "animal", value: "dog" },
  { type: "animal", value: "dog" },
  { type: "animal", value: "dog" },
  { type: "animal", value: "dog" },
  { type: "animal", value: "cat" },
  { type: "animal", value: "cat" },
  { type: "animal", value: "cat" },
  { type: "animal", value: "cat" },
  { type: "animal", value: "bird" },
  { type: "animal", value: "bird" },
  { type: "animal", value: "bird" },
  { type: "animal", value: "bird" },
  { type: "animal", value: "elephant" },
  { type: "animal", value: "elephant" },
  { type: "animal", value: "elephant" },
  { type: "animal", value: "elephant" },
  { type: "animal", value: "camel" },
  { type: "animal", value: "camel" },
  { type: "animal", value: "camel" },
  { type: "animal", value: "camel" },
  { type: "animal", value: "bear" },
  { type: "animal", value: "bear" },
  { type: "animal", value: "bear" },
  { type: "animal", value: "bear" },
];

// getIcon fonksiyonunun döndürdüğü değer için tip tanımla
export const getIcon = (value: string) => {
  switch (value) {
    case "discord":
      return <Icon icon="skill-icons:discord" width="48" height="48" />;
    case "linkedin":
      return <Icon icon="devicon:linkedin" width="48" height="48" />;
    case "x":
      return (
        <Icon
          icon="fa6-brands:square-x-twitter"
          width="48"
          height="48"
          style={{ color: "#000" }}
        />
      );
    case "github":
      return <Icon icon="skill-icons:github-dark" width="48" height="48" />;
    case "facebook":
      return <Icon icon="logos:facebook" width="48" height="48" />;
    case "youtube":
      return <Icon icon="logos:youtube-icon" width="48" height="48" />;
    case "dog":
      return <Icon icon="emojione:dog-face" width="48" height="48" />;
    case "cat":
      return <Icon icon="emojione:cat-face" width="48" height="48" />;
    case "bird":
      return <Icon icon="emojione:bird" width="48" height="48" />;
    case "elephant":
      return <Icon icon="emojione:elephant" width="48" height="48" />;
    case "camel":
      return <Icon icon="emojione:camel" width="48" height="48" />;
    case "bear":
      return <Icon icon="emojione:bear" width="48" height="48" />;
    default:
      return <Icon icon="twemoji:joker" width="48" height="48" />;
  }
};
