import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { api } from '../lib/api';

interface Category {
  id: string;
  name: string;
}

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const isAdmin = profile?.is_admin === true;
  const isRegisteredUser = user && !isAdmin;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Lấy profile nếu đã login
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const res = await api.get('/api/auth/profile', {
            //headers: { Authorization: `Bearer ${user.token}` },
          });
          setUserName(res.data.name || '');
        } catch (err) {
          console.error('Load profile failed:', err);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-[#3E5D2A] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">H&T</div>
          </Link>

          {/* Admin */}
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                ADMIN
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-white text-[#3E5D2A] hover:bg-gray-100 rounded-lg font-semibold transition-colors"
              >
                ĐĂNG XUẤT
              </button>
            </div>
          ) : (
            <>
              {/* Nav */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Trang chủ
                </Link>

                {/* Dropdown Categories */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowMenuDropdown(true)}
                  onMouseLeave={() => setShowMenuDropdown(false)}
                >
                  <button className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors flex items-center gap-1">
                    Menu bánh
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showMenuDropdown && (
                    <>
                      {/* Lớp đệm hover */}
                      <div className="absolute top-full left-0 w-full h-4 z-40"></div>

                      {/* Dropdown */}
                      <div className="absolute top-[calc(100%+0.25rem)] left-0 mt-0 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                        {categories.map((c) => (
                          <Link
                            key={c.id}
                            to={`/products?category=${c.id}`}
                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/delivery"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Giao hàng
                </Link>
                <Link
                  to="/contact"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Liên hệ
                </Link>
                <Link
                  to="/stores"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Cửa hàng
                </Link>
                <Link
                  to="/loyalty"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Khách hàng thân thiết
                </Link>
                <Link
                  to="/news"
                  className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Tin tức
                </Link>

                {isRegisteredUser && (
                  <Link
                    to="/my-orders"
                    className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
                  >
                    Đơn hàng
                  </Link>
                )}
              </nav>

              {/* Cart & Auth & User */}
              <div className="flex items-center gap-4">
                <Link
                  to="/cart"
                  className="relative hover:text-orange-400 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                    {/* User name rectangle */}
                    <Link
                      to="/user-profile"
                      className="px-3 py-1 bg-white text-[#3E5D2A] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {userName || 'User'}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-white text-[#3E5D2A] hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                    >
                      ĐĂNG XUẤT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-white text-[#3E5D2A] hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

