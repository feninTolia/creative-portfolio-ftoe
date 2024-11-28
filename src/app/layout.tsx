import Header from '@/components/Header';
import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const urbanist = Urbanist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anatolii Fenin Portfolio',
  description: 'Created by Tolik',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" bg-slate-900 text-slate-100">
      <body className={`${urbanist.className}  antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
