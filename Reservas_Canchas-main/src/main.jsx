import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Junta } from './components/Junta'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Junta />
   
  </StrictMode>,
)
