import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nawi Experiences | Uganda's Premier Event & Experience Designers",
  description: "Nawi Experiences is your trusted partner for unforgettable events — from honeymoons and romantic getaways to birthdays, anniversaries, proposals, and bespoke celebrations. Every detail, curated to perfection.",
  keywords: [
    "nawi experiences",
    "event organizers Uganda",
    "honeymoon planners",
    "romantic experiences",
    "birthday event designers",
    "anniversary celebrations",
    "proposal planners",
    "bespoke events",
    "luxury event planning",
    "private celebrations",
    "curated experiences",
    "intimate events Uganda",
  ],
  openGraph: {
    title: "Nawi Experiences | Uganda's Premier Event & Experience Designers",
    description: "From honeymoons to birthdays — we design extraordinary moments for every milestone. Curated. Intimate. Unforgettable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
