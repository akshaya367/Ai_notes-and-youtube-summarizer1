import './globals.css';
import type { Metadata } from 'next';
import BackgroundWrapper from '@/components/Background/BackgroundWrapper';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export const metadata: Metadata = {
  title: 'Nexus AI | Premium Customer Support',
  description: 'Scalable, secure, and AI-powered customer support for modern enterprises.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div style={{ position: 'relative', minHeight: '100vh', zIndex: 0 }}>
          <BackgroundWrapper />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1, minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
