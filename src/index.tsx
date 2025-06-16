import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './Context/Theme'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.withCredentials = true
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
