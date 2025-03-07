import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NavProvider from '@/providers/NavProvider';
import TanstackProvider from '@/providers/TanstackProvider';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackProvider>
          <AuthProvider>
            <NavProvider>
              <Toaster
                position="bottom-right"
                reverseOrder={false}
              />
                <main>
                  {children}
                </main>
            </NavProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
