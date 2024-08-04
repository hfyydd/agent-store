import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NavBar from '@/components/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <NavBar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="w-full border-t border-t-foreground/10 p-4 text-center">
          <p className="text-xs">
            Powered by{" "}
            <a
              href=""
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              找自己
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}