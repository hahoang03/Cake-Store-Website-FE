import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import FloatingButtons from './components/FloatingButtons';
import ProductList from './pages/product/ProductList';
import ProductDetail from './pages/product/ProductDetail';
import Cart from './pages/cart/Cart';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Delivery from './pages/content/Delivery';
import Contact from './pages/content/Contact';
import Stores from './pages/content/Stores';
import Loyalty from './pages/content/Loyalty';
import News from './pages/content/News';
import Signup from './pages/auth/Signup'
import AdminRoute from './routes/AdminRoute';
import OrderTracking from './pages/order/OrderTracking'
import OrderDetail from './pages/order/OrderDetail';
import UserProfile from './pages/user/UserProfile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="bg-gradient-to-br from-[#eef3ea] to-white">
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/loyalty" element={<Loyalty />} />
                <Route path="/news" element={<News />} />
                <Route path="/my-orders" element={<OrderTracking />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />

              </Routes>
            </main>
            <FloatingButtons />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

