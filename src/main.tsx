import React from 'react'
import ReactDOM from 'react-dom/client'
import './firebase'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary sectionName="Plataforma VÉLIA">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
