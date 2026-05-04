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
  title: "KIDOSKIEE | PORTOFOLIO",
  description:
    "Portfolio of KIDOSKIEE — AMV Editor & Motion Designer. Cinematic Anime Music Videos, motion graphics, and visual effects that tell stories.",
  keywords: ["AMV Editor", "Motion Designer", "Anime Music Video", "Video Editing", "Motion Graphics"],
  openGraph: {
    title: "KIDOSKIEE | AMV Editor & Motion Designer",
    description: "Cinematic Anime Music Videos, motion graphics, and visual effects.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <body className="bg-kafka-theme text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
