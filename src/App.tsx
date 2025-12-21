import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import FloatingButtons from './components/FloatingButtons';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import Stores from './pages/Stores';
import Loyalty from './pages/Loyalty';
import News from './pages/News';
import Signup from './pages/Signup'
import AdminRoute from './routes/AdminRoute';
import OrderTracking from './pages/OrderTracking'
import OrderDetail from './pages/OrderDetail';
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
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
                 <Route path="//user-profile" element={<UserProfile />} />
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

