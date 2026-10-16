import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        style: {
          border: '1px solid #ff4f0a',
          padding: '16px',
          color: '#333333',
          boxShadow: '0 4px 6px -1px rgba(255, 79, 10, 0.1), 0 2px 4px -1px rgba(255, 79, 10, 0.06)',
        },
        success: {
          iconTheme: {
            primary: '#ff4f0a',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
}
