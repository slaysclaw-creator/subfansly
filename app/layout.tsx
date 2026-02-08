import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SubFansly - Creator Subscriptions',
  description: 'Support your favorite creators directly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --black: #000;
            --dark: #1a1a1a;
            --gray: #333;
            --light-gray: #666;
            --white: #fff;
            --accent: #ff005e;
            --purple: #9d4edd;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background-color: var(--black);
            color: var(--white);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
          }

          html, body {
            height: 100%;
          }

          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>
        <Navbar />
        <main style={{ flex: 1, background: 'var(--black)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
