import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoScribe | Turn Any GitHub Repository Into a Stunning README",
  description: "Paste your GitHub repository URL and let AI analyze your project to generate a polished, professional README in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`} style={{ colorScheme: 'dark' }}>
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-[#7C3AED] selection:text-white">
        {children}
      </body>
    </html>
  );
}
