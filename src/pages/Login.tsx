import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, profile, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await signIn(email, password)
      if (!success) {
        setError('Email hoặc mật khẩu không đúng')
        setLoading(false)
        return
      }
      // Login thành công, sẽ redirect trong useEffect
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !profile) return

    // Nếu admin -> /admin, user thường -> trang chủ
    if (profile.is_admin) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [user, profile, navigate])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Đăng nhập</h1>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border p-3 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E5D2A] text-white py-3 rounded font-bold"
            >
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/" className="text-[#3E5D2A] font-semibold block">
              ← Quay lại trang chủ
            </Link>
            <Link to="/signup" className="text-[#3E5D2A] font-semibold block">
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
