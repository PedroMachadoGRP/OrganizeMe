'use client'

import { AuthProvider } from '@/app/contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import './globals.css';



export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <SnackbarProvider maxSnack={1}>
          {children}
          </SnackbarProvider>
          
        </AuthProvider>
      </body>
    </html>



  );
}