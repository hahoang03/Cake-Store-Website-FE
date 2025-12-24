import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ShoppingCart, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { api } from '../lib/api'

interface Category {
  id: string
  name: string
}

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)
  const [userName, setUserName] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // state mobile

  const isAdmin = profile?.is_admin === true
  const isRegisteredUser = user && !isAdmin

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories')
        setCategories(res.data.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const res = await api.get('/api/auth/profile')
          setUserName(res.data.name || '')
        } catch (err) {
          console.error(err)
        }
      }
    }
    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#3E5D2A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-extrabold tracking-wide hover:text-orange-400 transition">
            H&T
          </Link>

          {/* DESKTOP NAV */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-8">
              <Link className="nav-link" to="/">Trang chủ</Link>
              <div
                className="relative"
                onMouseEnter={() => setShowMenuDropdown(true)}
                onMouseLeave={() => setShowMenuDropdown(false)}
              >
                <button className="nav-link flex items-center gap-1">
                  Menu bánh <ChevronDown size={16} />
                </button>
                {showMenuDropdown && (
                  <>
                    <div className="absolute top-full left-0 w-full h-4 z-40"></div>
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl py-2">
                      {categories.map(c => (
                        <Link key={c.id} to={`/products?category=${c.id}`} className="block px-4 py-2 hover:bg-gray-100 transition">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Link className="nav-link" to="/delivery">Giao hàng</Link>
              <Link className="nav-link" to="/contact">Liên hệ</Link>
              <Link className="nav-link" to="/stores">Cửa hàng</Link>
              <Link className="nav-link" to="/news">Tin tức</Link>
              <Link className="nav-link" to="/custom">Thiết kế bánh</Link>
              {isRegisteredUser && <Link className="nav-link" to="/my-orders">Đơn hàng</Link>}
            </nav>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative hover:text-orange-400">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/user-profile" className="px-3 py-1 bg-white text-[#3E5D2A] rounded-lg font-semibold hover:bg-gray-100 transition">
                  {userName || 'User'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-white rounded-lg font-semibold hover:bg-white hover:text-[#3E5D2A] transition"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border border-white rounded-lg font-semibold hover:bg-white hover:text-[#3E5D2A] transition">
                  Đăng nhập
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition">
                  Đăng ký
                </Link>
              </>
            )}

            {/* HAMBURGER MOBILE */}
            {!isAdmin && (
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(prev => !prev)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {!isAdmin && mobileMenuOpen && (
        <div className="md:hidden bg-[#3E5D2A] text-white px-6 py-4 space-y-2">
          <Link to="/" className="block py-2 nav-link">Trang chủ</Link>
          <div className="space-y-1">
            <span className="block py-2 nav-link">Menu bánh</span>
            <div className="pl-4 space-y-1">
              {categories.map(c => (
                <Link key={c.id} to={`/products?category=${c.id}`} className="block py-2 hover:text-orange-400 transition">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/delivery" className="block py-2 nav-link">Giao hàng</Link>
          <Link to="/contact" className="block py-2 nav-link">Liên hệ</Link>
          <Link to="/stores" className="block py-2 nav-link">Cửa hàng</Link>
          <Link to="/loyalty" className="block py-2 nav-link">Khách hàng thân thiết</Link>
          <Link to="/news" className="block py-2 nav-link">Tin tức</Link>
          {isRegisteredUser && <Link to="/my-orders" className="block py-2 nav-link">Đơn hàng</Link>}
        </div>
      )}

      <style>
        {`
          .nav-link {
            text-transform: uppercase;
            font-size: 0.875rem;
            font-weight: 600;
            transition: color 0.2s;
          }
          .nav-link:hover {
            color: #fb923c;
          }
        `}
      </style>
    </header>
  )
}
