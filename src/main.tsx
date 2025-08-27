import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from './providers/theme.provider'
import { RouterProvider } from 'react-router'
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store'
import { router } from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)
