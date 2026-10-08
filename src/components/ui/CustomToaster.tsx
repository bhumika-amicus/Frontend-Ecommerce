import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: {
          border: '1px solid #ff6b00',
          padding: '16px',
          color: '#333',
          boxShadow: '0 4px 6px -1px rgba(255, 107, 0, 0.1), 0 2px 4px -1px rgba(255, 107, 0, 0.06)',
        },
        success: {
          iconTheme: {
            primary: '#ff6b00',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
