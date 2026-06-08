import "./globals.css";

export const metadata = {
  title: "Interactive Digital Thorana",
  description: "Animated Pandal created with Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vesak Thorana",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#FFD700",
};

export default function RootLayout({ children }) {
  return (
    <html lang="si" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-['Noto_Sans_Sinhala',_sans-serif]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
