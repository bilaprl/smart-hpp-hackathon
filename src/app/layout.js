import "./globals.css";
import { ThemeProvider } from "../components/ThemeContext";

export const metadata = {
  title: "SmartHPP - AI Integrated Financial Analyst",
  description: "Solusi Manajemen HPP dan Credit Scoring UMKM",
  other: {
    "dicoding:email": "apriliantinabila04@gmail.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body
        className="m-0 p-0 w-full overflow-x-hidden bg-smart-bg text-smart-text font-sans antialiased"
        suppressHydrationWarning // Tambahkan ini
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
