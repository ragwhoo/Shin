import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Experience Engine' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-3 flex items-center gap-6">
          <Link href="/" className="font-bold text-blue-700">Experience Engine</Link>
          <Link href="/graph" className="text-sm text-gray-600 hover:text-blue-700">Graph</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
