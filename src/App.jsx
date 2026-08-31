import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PublicMenu from './pages/PublicMenu'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicMenu />} />

          <Route path="/sistem/login" element={<Login />} />
          <Route
            path="/sistem"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Old paths redirect so existing bookmarks/links still work */}
          <Route path="/admin/login" element={<Navigate to="/sistem/login" replace />} />
          <Route path="/admin/dashboard" element={<Navigate to="/sistem" replace />} />
          <Route path="/admin" element={<Navigate to="/sistem" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
