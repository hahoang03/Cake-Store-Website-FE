import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, X } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'



interface Product {
  id: string
  name: string
  image: string
  price: number
  category_id: string
  count_in_stock: number 
}


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
    shipping_postal_code: '700000',
    shipping_country: 'VietNam',
  })

  const [errors, setErrors] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    shipping_city: '',
  });


  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])



  useEffect(() => {
  const fetchSuggestedProducts = async () => {
    try {
      const res = await api.get('/api/products') 
      const allProducts: Product[] = res.data.data || []
      const shuffled = allProducts.sort(() => 0.5 - Math.random()).slice(0, 6)
      setSuggestedProducts(shuffled)
    } catch (err) {
      console.error(err)
    }
  }

  fetchSuggestedProducts()
}, [])




  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { redirect: '/cart' } })
    }
  }, [user, loading, navigate])

  if (loading) return <p className="text-center py-20">Đang kiểm tra đăng nhập...</p>
  if (!user) return null


    const shippingPrice = 30_000 
  const TAX_RATE = 0.05

  // FE tính tạm để hiển thị
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxPrice = Math.round(itemsPrice * TAX_RATE)
  
  const totalPrice = itemsPrice + taxPrice + shippingPrice


  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    try {
      const res = await api.get(`/api/products/${productId}`)
      const product = res.data.data

      if (newQty > product.count_in_stock) {
        alert(`Bạn chỉ có thể mua tối đa ${product.count_in_stock} sản phẩm này`)
        return
      }

      if (newQty <= 0) {
        removeFromCart(productId)
        return
      }

      updateQuantity(productId, newQty)
    } catch (err) {
      console.error(err)
    }
  }

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
        shipping_address: formData.delivery_address,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_country: formData.shipping_country,
      }

      await api.post('/api/orders', body)
      clearCart()
      setShowCheckout(false)
      setOrderSuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || 'Đặt hàng thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderSuccess) {
  return (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fadeIn">
      <h2 className="text-2xl font-bold text-green-600 mb-8">
        Đặt hàng thành công, cảm ơn bạn đã mua hàng!
      </h2>

      <h3 className="text-xl text-orange-500 font-semibold mb-6">Sản phẩm liên quan</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestedProducts.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-4 text-center">
              <h4 className="text-lg font-semibold mb-2 line-clamp-2">{p.name}</h4>
              <p className="text-orange-500 font-bold">
                {p.price.toLocaleString('vi-VN')} ₫
              </p>
              <span
                className={`inline-block mt-3 px-3 py-1 text-sm rounded-full ${
                  p.count_in_stock > 0
                    ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {p.count_in_stock > 0 ? 'Xem chi tiết' : 'Hết hàng'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/" className="inline-block mt-10 text-orange-500 font-bold">
        Tiếp tục mua sắm
      </Link>
    </div>
  )
}


  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link to="/" className="text-orange-500 font-bold">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="bg-white p-6 rounded shadow flex gap-6">
              <img src={item.productImage} alt={item.productName} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{item.productName}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="border p-1">
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="border p-1">
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

        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="font-bold text-xl mb-4">Tổng đơn</h2>
          <div className="flex justify-between mb-2">
            <span>Tạm tính</span>
            <span>{itemsPrice.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span>
              {shippingPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Thuế</span>
            <span>{taxPrice.toLocaleString('vi-VN')} ₫</span>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const newErrors = {
                  customer_name: formData.customer_name.trim() ? '' : 'Vui lòng nhập họ và tên',
                  customer_phone: /^(0|\+84)\d{9,10}$/.test(formData.customer_phone) ? '' : 'Số điện thoại không hợp lệ',
                  customer_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email) ? '' : 'Email không hợp lệ',
                  delivery_address: formData.delivery_address.trim() ? '' : 'Vui lòng nhập địa chỉ giao hàng',
                  shipping_city: formData.shipping_city.trim() ? '' : 'Vui lòng chọn thành phố',
                };

                setErrors(newErrors);

                // Nếu có lỗi thì dừng submit
                if (Object.values(newErrors).some(msg => msg)) return;

                handleCheckout(e);
              }}
              className="space-y-4"
            >
              <div>
                <input
                  placeholder="Họ và tên"
                  className="w-full border p-3 rounded"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
              </div>

              <div>
                <input
                  placeholder="Số điện thoại"
                  className="w-full border p-3 rounded"
                  value={formData.customer_phone}
                  onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                />
                {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
              </div>

              <div>
                <input
                  placeholder="Email"
                  className="w-full border p-3 rounded"
                  value={formData.customer_email}
                  onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                />
                {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Địa chỉ giao hàng"
                  className="w-full border p-3 rounded"
                  value={formData.delivery_address}
                  onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                />
                {errors.delivery_address && <p className="text-red-500 text-sm mt-1">{errors.delivery_address}</p>}
              </div>

              <div>
                <select
                  className="w-full border p-3 rounded"
                  value={formData.shipping_city}
                  onChange={e => setFormData({ ...formData, shipping_city: e.target.value })}
                >
                  <option value="">Chọn thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
                {errors.shipping_city && <p className="text-red-500 text-sm mt-1">{errors.shipping_city}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded"
              >
                Xác nhận đặt hàng
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
