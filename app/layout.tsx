import type { Metadata } from "next";
import "./globals.css";
import React from 'react';

export const metadata: Metadata = {
  title: "Importaciones Fakunet | Admin",
  description: "Panel de administración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}