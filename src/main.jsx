import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

import('./App.jsx')
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })
  .catch((err) => {
    root.render(
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: '#f5f5f5', fontFamily: 'monospace', padding: '2rem',
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ color: '#f59e0b' }}>Startup Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#fca5a5' }}>{err.message}</pre>
        </div>
      </div>
    )
  })
