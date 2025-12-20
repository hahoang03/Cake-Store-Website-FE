import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, X } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

export default function Cart() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()

  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Chuyển khoản'>('COD')
  const [showCheckout, setShowCheckout] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: '',
  })

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { redirect: '/cart' } })
    }
  }, [user, loading, navigate])

  if (loading) {
    return <p className="text-center py-20">Đang kiểm tra đăng nhập...</p>
  }

  if (!user) return null

  /* ================= PRICE ================= */
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxPrice = 0
  const shippingPrice = 30000
  const totalPrice = itemsPrice + taxPrice + shippingPrice

  /* ================= CHECKOUT ================= */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      alert('Giỏ hàng trống')
      return
    }

    setSubmitting(true)
    try {
      const body = {
        user_id: user.id,
        order_items: items.map(item => ({
          product_id: item.productId,
          qty: item.quantity,
          price: item.price,
          name: item.productName,
          image: item.productImage,
        })),
        payment_method: paymentMethod,
        items_price: itemsPrice,
        tax_price: taxPrice,
        shipping_price: shippingPrice,
        total_price: totalPrice,
        shipping_address: formData.delivery_address,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_country: formData.shipping_country,
      }

      await api.post('/api/orders', body)
      clearCart()
      setShowCheckout(false)
      setOrderSuccess(true)
    } catch (err) {
      console.error(err)
      alert('Đặt hàng thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  /* ================= SUCCESS ================= */
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Đặt hàng thành công 🎉</h2>
        <Link to="/" className="text-orange-500 font-bold">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  /* ================= EMPTY ================= */
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link to="/" className="text-orange-500 font-bold">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  /* ================= MAIN ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="bg-white p-6 rounded shadow flex gap-6">
              <img src={item.productImage} alt={item.productName} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{item.productName}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="border p-1">
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="border p-1">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</p>
                <button onClick={() => removeFromCart(item.productId)} className="text-red-500 mt-2">
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold text-xl mb-4">Tổng đơn</h2>
          <div className="flex justify-between mb-2">
            <span>Tạm tính</span>
            <span>{itemsPrice.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span>{shippingPrice.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between font-bold text-xl">
            <span>Tổng cộng</span>
            <span className="text-orange-500">{totalPrice.toLocaleString('vi-VN')} ₫</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded"
          >
            Tiến hành đặt hàng
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {/* CHECKOUT MODAL */}
{showCheckout && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        onClick={() => setShowCheckout(false)}
      >
        <X size={20} />
      </button>
      <h3 className="text-xl font-bold mb-4">Thông tin giao hàng</h3>
      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          required placeholder="Họ và tên" className="w-full border p-3 rounded"
          value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
        />
        <input
          required placeholder="Số điện thoại" className="w-full border p-3 rounded"
          value={formData.customer_phone} onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
        />
        <input
          required type="email" placeholder="Email" className="w-full border p-3 rounded"
          value={formData.customer_email} onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
        />
        <textarea
          required placeholder="Địa chỉ giao hàng" className="w-full border p-3 rounded"
          value={formData.delivery_address} onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
        />
        <input
          required placeholder="Thành phố" className="w-full border p-3 rounded"
          value={formData.shipping_city} onChange={e => setFormData({ ...formData, shipping_city: e.target.value })}
        />
        <input
          required placeholder="Mã bưu chính" className="w-full border p-3 rounded"
          value={formData.shipping_postal_code} onChange={e => setFormData({ ...formData, shipping_postal_code: e.target.value })}
        />
        <input
          required placeholder="Quốc gia" className="w-full border p-3 rounded"
          value={formData.shipping_country} onChange={e => setFormData({ ...formData, shipping_country: e.target.value })}
        />

        {/* PAYMENT */}
        <div className="space-y-2">
          <p className="font-semibold">Phương thức thanh toán</p>
          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentMethod === 'Chuyển khoản'} onChange={() => setPaymentMethod('Chuyển khoản')} />
            Chuyển khoản ngân hàng
          </label>
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white py-3 rounded">
          {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  )
}
