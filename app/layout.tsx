import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import AuthModal from "./components/AuthModal";

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
      <body className="min-h-full flex flex-col bg-background text-[#FAFAFA] font-sans selection:bg-[#7C3AED] selection:text-white">
        <AuthProvider>
          {children}
          <AuthModal />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#0a0a0c',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
