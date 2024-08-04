import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NavBar from '@/components/NavBar';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Agent Store",
  description: "The fastest way to exchange your Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}