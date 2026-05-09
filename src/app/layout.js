import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "kidoobileks",
  description:
    "Portfolio of KID — AMV Editor & Motion Designer. Cinematic Anime Music Videos, motion graphics, and visual effects that tell stories.",
  keywords: ["AMV Editor", "Motion Designer", "Anime Music Video", "Video Editing", "Motion Graphics"],
  openGraph: {
    title: "KID | AMV Editor & Designer",
    description: "Cinematic Anime Music Videos, motion graphics, and visual effects.",
    type: "website",
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <body className="bg-mograph-theme min-h-screen flex flex-col relative overflow-x-hidden">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
