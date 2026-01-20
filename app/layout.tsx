import "./globals.css";
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Monitoring Getaran Rooftop UNPAR',
  description: 'Prototype Dashboard IoT',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body className="flex bg-slate-900 text-slate-100 min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 fixed h-full overflow-y-auto">
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-400 mb-1">WSN Microzonation</h1>
            <p className="text-xs text-slate-400">Gedung 10 UNPAR</p>
          </div>
          
          <nav className="px-4 space-y-2">
            <Link href="/" className="block p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-3">
               <span>Dashboard</span>
            </Link>
            <Link href="/history" className="block p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-3">
               <span>Riwayat Data</span>
            </Link>
            
          </nav>
        </aside>

        {/* KONTEN UTAMA */}
        <main className="flex-1 ml-64 p-8 bg-slate-900">
          {children}
        </main>

      </body>
    </html>
  );
}