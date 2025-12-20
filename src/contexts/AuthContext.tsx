import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../lib/api'

export interface User {
  id: string
  email: string
  name: string;
}

export interface UserProfile {
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile')
      setUser(res.data.user)
      setProfile(res.data.profile)
    } catch (err) {
      console.error('Load profile failed', err)
      signOut()
    } finally {
      setLoading(false)
    }
  }

  // LOGIN
  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })

      const { user, token } = res.data.data

      localStorage.setItem('token', token)

      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      })

      setProfile({
        is_admin: user.is_admin,
      })

      return true
    } catch (err) {
      console.error('Login failed', err)
      return false
    }
  }

  // REGISTER
  const signUp = async (name: string, email: string, password: string) => {
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
      })
      return true
    } catch (err) {
      console.error('Register failed', err)
      return false
    }
  }

  const signOut = () => {
    localStorage.removeItem('token')
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
