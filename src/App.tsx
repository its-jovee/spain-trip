import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { ItineraryPage } from './pages/ItineraryPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { ChecklistsPage } from './pages/ChecklistsPage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <p className="small-caps">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ItineraryPage />} />
        <Route path="itinerary" element={<Navigate to="/" replace />} />
        <Route path="today" element={<Navigate to="/" replace />} />
        <Route path="calendar" element={<Navigate to="/" replace />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="checklists" element={<ChecklistsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProtectedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
