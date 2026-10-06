import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import TodosProvider from './state/TodosProvider'
import SettingsProvider from './state/SettingsProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 모든 페이지가 같은 할 일 / 설정을 보도록 Routes보다 위에서 감싼다 */}
      <TodosProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </TodosProvider>
    </BrowserRouter>
  </StrictMode>,
)
