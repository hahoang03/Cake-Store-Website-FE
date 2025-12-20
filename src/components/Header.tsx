import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-[#3E5D2A] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">H&T</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="uppercase text-sm font-semibold hover:text-orange-400 transition-colors"
            >
              Trang chủ
            </Link>

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
                <div className="absolute top-full left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2">
                  <Link
                    to="/products?category=banh-flan"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bánh Flan
                  </Link>
                  <Link
                    to="/products?category=banh-sinh-nhat"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bánh Sinh Nhật
                  </Link>
                  <Link
                    to="/products?category=banh-mousse"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bánh Mousse
                  </Link>
                  <Link
                    to="/products?category=banh-tiramisu"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bánh Tiramisu
                  </Link>
                  <Link
                    to="/products?category=banh-trai-cay"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bánh Trái Cây
                  </Link>
                </div>
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
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative hover:text-orange-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
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
              <Link
                to="/login"
                className="px-6 py-2 bg-white text-[#3E5D2A] hover:bg-gray-100 rounded-lg font-semibold transition-colors"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
