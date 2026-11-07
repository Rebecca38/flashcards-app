import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LearnEasy from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LearnEasy />
  </StrictMode>,
)
