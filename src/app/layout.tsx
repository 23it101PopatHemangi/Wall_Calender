import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import "./globals.css";

const sansFont = Manrope({
  variable: "--font-sans-custom",
  subsets: ["latin"],
});

const serifFont = Lora({
  variable: "--font-serif-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Wall Calendar",
  description: "Elegant wall calendar with range selection and notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
