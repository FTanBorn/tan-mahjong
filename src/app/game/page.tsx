import * as React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import GameBoard from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <div className={styles.greenPage}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          Ana Sayfa
        </Link>
      </div>
      <GameBoard />
    </div>
  );
}
