'use client'

import { AuthProvider } from '@/app/contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import './globals.css';
import { ThemeProvider } from './contexts/themeProvider';



export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <meta charSet='UTF-8' />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OrganizaMe</title>
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
