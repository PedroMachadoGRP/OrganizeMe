'use client'

import { AuthProvider } from '@/app/contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import './globals.css';
import { ThemeProvider } from './contexts/themeProvider';



export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <SnackbarProvider maxSnack={1}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </body>
    </html>



  );
}