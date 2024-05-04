import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FirebaseProvider } from './context/firebaseAuth.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        {/* <main className="dark text-foreground bg-background"> */}
          <App />
        {/* </main> */}
      </FirebaseProvider>
    </BrowserRouter>
  </React.StrictMode>
)
