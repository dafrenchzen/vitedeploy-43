import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Studio } from './pages/Studio'
import { Beats } from './pages/Beats'
import { Booking } from './pages/Booking'
import { BookingConfirmation } from './pages/BookingConfirmation'
import { Auth } from './pages/Auth'
import { Profile } from './pages/Profile'
import { Admin } from './pages/Admin'
import { AdminLogin } from './pages/AdminLogin'
import { AdminMigration } from './pages/AdminMigration'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Header } from './components/Header'
import { Footer } from './components/layout/Footer'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const adminToken = localStorage.getItem('adminToken')

  if (!adminToken) {
    return <Navigate to="/admin/login" />
  }

  return <>{children}</>
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" />
  }

  return <>{children}</>
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-dark-300 to-dark-300">
      {!isAdminRoute && (
        <>
          <Header />
          <Navbar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/studio"
          element={
            <PrivateRoute>
              <Studio />
            </PrivateRoute>
          }
        />
        <Route path="/beats" element={<Beats />} />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking/confirmation/:bookingId"
          element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          path="/admin/migration"
          element={
            <AdminRoute>
              <AdminMigration />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
