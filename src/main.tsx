import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import MainLayout from './MainLayout'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.withCredentials = true
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>,
)
