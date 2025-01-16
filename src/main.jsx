import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import '/node_modules/bootstrap/dist/css/bootstrap.min.css'
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/all.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
