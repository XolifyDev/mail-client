import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { HashRouter } from "react-router-dom";
import './index.css'
import './App.css'
import { AuthContextProvider } from './contexts/AuthContext.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { SocketContextProvider } from './contexts/SocketContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <HashRouter>
    <AuthContextProvider>
      <Toaster />
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </HashRouter>
  // </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
