import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#09090B',
              border: '1px solid #18181B',
              color: '#F4F4F5',
              fontFamily: 'Inter, sans-serif'
            }
          }}
          closeButton
          richColors
        />
      </ChatProvider>
    </ThemeProvider>
  );
}
