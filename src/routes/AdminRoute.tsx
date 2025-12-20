import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { loading, profile } = useAuth()

  if (loading) return null

  if (!profile?.is_admin) {
    return <Navigate to="/login" replace />
  }

  return children
}
