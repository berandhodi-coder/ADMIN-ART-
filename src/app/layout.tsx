import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Art Bouquet Admin', description: 'Admin Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#09090b] text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
