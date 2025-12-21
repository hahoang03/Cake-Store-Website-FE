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
        return
      }
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !profile) return

    if (profile.is_admin) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [user, profile, navigate])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-[#eef3ea] to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-[#3E5D2A] mb-2">
            Đăng nhập
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Chào mừng bạn quay lại 
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-600 px-4 py-2 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E5D2A] focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E5D2A] focus:border-transparent transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E5D2A] hover:bg-[#2f4a22] text-white py-3 rounded-xl font-bold transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2 text-sm">
            <Link
              to="/"
              className="block text-gray-500 hover:text-[#3E5D2A] transition"
            >
              ← Quay lại trang chủ
            </Link>

            <Link
              to="/signup"
              className="block text-[#3E5D2A] font-semibold hover:underline"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
