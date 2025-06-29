import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './Context/Theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './Hooks/QueryClient'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    
  </StrictMode>,
)
