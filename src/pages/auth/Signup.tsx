import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

type ErrorMap = Record<string, string>

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<ErrorMap>({})
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: ErrorMap = {}

    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ và tên'
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email'
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu'
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await signUp(name, email, password)

    setLoading(false)

    if (result.success) {
      navigate('/login')
    } else {
      setErrors(mapBackendError(result.message || ''))
    }
  }

  /* ===== MAP LỖI BE ===== */
  const mapBackendError = (message: string): ErrorMap => {
    const err: ErrorMap = {}

    if (message.includes('at least 8'))
      err.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    else if (message.includes('more than 128'))
      err.password = 'Mật khẩu không được vượt quá 128 ký tự'
    else if (
      message.includes('12345678') ||
      message.includes('password') ||
      message.includes('Password123')
    )
      err.password = 'Mật khẩu quá yếu'
    else if (message.toLowerCase().includes('exists'))
      err.email = 'Email đã tồn tại'
    else if (message.toLowerCase().includes('email format'))
      err.email = 'Email không đúng định dạng'
    else err.password = 'Đăng ký thất bại'

    return err
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg outline-none transition
     ${errors[field]
      ? 'border-red-500 focus:border-red-500 focus:ring-0'
      : 'border-gray-300 focus:border-gray-400 focus:ring-0'
    }`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef3ea] to-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#3E5D2A]">
          Đăng ký
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 inset-y-0 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass('confirmPassword')}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 inset-y-0 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#3E5D2A] text-white font-bold rounded-lg hover:bg-[#2d4320] disabled:bg-gray-400"
          >
            {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#3E5D2A] font-semibold hover:underline"
          >
            ← Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
