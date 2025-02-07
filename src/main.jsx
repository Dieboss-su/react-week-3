import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css'
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/all.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <HashRouter >
      <App />
    </HashRouter>
  // </StrictMode>,
)
