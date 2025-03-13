// --------------------- app/layout.tsx ---------------------
import * as React from "react";
import { Metadata } from "next";
import { Container } from "@mui/material";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata: Metadata = {
  title: "NextJS MUI App",
  description: "NextJS App Router projesi ile MUI kullanımı",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
