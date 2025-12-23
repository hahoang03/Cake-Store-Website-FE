import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type OrderItem = {
  id: string
  product_id: string
  qty: number
  price: number
  name: string
  image: string
}

type Order = {
  id: string
  user_id: string
  payment_method: string
  items_price: number
  tax_price: number
  shipping_price: number
  total_price: number
  is_paid: boolean
  paid_at: string | null
  is_delivered: boolean
  delivered_at: string | null
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  order_items?: OrderItem[]
  users?: { id: string; name: string; email: string }
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders') // Admin API lấy tất cả đơn
      setOrders(res.data.data || [])
    } catch (err) {
      console.error('Load orders error:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetail = async (id: string) => {
    try {
      const res = await api.get(`/api/orders/${id}`)
      setSelectedOrder(res.data.data)
    } catch (err) {
      console.error('Load order detail error:', err)
      setSelectedOrder(null)
      alert('Không thể tải chi tiết đơn hàng')
    }
  }

  const closeDetail = () => setSelectedOrder(null)

  const markPaid = async (id: string, payment_method: string) => {
    try {
      const res = await api.put(`/api/orders/${id}/pay`, { payment_method })
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, is_paid: true, paid_at: res.data.data.paid_at } : o
        )
      )
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, is_paid: true, paid_at: res.data.data.paid_at })
      }
    } catch (err) {
      console.error('Mark paid error:', err)
    }
  }

  const markDelivered = async (id: string) => {
    try {
      const res = await api.put(`/api/orders/${id}/deliver`, {})
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, is_delivered: true, delivered_at: res.data.data.delivered_at } : o
        )
      )
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, is_delivered: true, delivered_at: res.data.data.delivered_at })
      }
    } catch (err) {
      console.error('Mark delivered error:', err)
    }
  }

  if (loading) return <div className="p-6">Đang tải danh sách đơn hàng...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng (Admin)</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Người đặt</th>
            <th className="p-2 text-left">Tổng giá</th>
            <th className="p-2 text-left">Thanh toán</th>
            <th className="p-2 text-left">Giao hàng</th>
            <th className="p-2 text-left">Địa chỉ</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td
                className="p-2 text-blue-600 cursor-pointer"
                onClick={() => fetchOrderDetail(o.id)}
              >
                {o.id}
              </td>
              <td className="p-2">{o.users?.name || 'Khách'}</td>
              <td className="p-2">{o.total_price.toLocaleString()} ₫</td>
              <td className="p-2">{o.is_paid ? `Đã thanh toán (${o.payment_method})` : 'Chưa thanh toán'}</td>
              <td className="p-2">{o.is_delivered ? 'Đã giao' : 'Chưa giao'}</td>
              <td className="p-2">{o.shipping_address}</td>
              <td className="p-2 flex gap-2">
                {!o.is_paid && (
                  <button
                    className="px-2 py-1 text-white bg-green-500 rounded"
                    onClick={() => markPaid(o.id, 'COD')}
                  >
                    Thanh toán
                  </button>
                )}
                {!o.is_delivered && (
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded"
                    onClick={() => markDelivered(o.id)}
                  >
                    Giao hàng
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết đơn */}
      {/* Modal chi tiết đơn */}
{selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
    <div className="bg-white p-6 rounded w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Chi tiết đơn: {selectedOrder.id}</h3>
        <button
          onClick={closeDetail}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Đóng
        </button>
      </div>

      <div className="border rounded p-4 mb-6">
        <p><span className="font-semibold">Người đặt:</span> {selectedOrder.users?.name || 'Khách'}</p>
        <p><span className="font-semibold">Tổng sản phẩm:</span> {selectedOrder.items_price.toLocaleString()}₫</p>
        <p><span className="font-semibold">Thuế:</span> {selectedOrder.tax_price.toLocaleString()}₫</p>
        <p><span className="font-semibold">Phí vận chuyển:</span> {selectedOrder.shipping_price.toLocaleString()}₫</p>
        <p><span className="font-semibold">Tổng đơn:</span> {selectedOrder.total_price.toLocaleString()}₫</p>
        <p><span className="font-semibold">Thanh toán:</span> {selectedOrder.is_paid ? `Đã thanh toán (${selectedOrder.paid_at})` : 'Chưa thanh toán'}</p>
        <p><span className="font-semibold">Giao hàng:</span> {selectedOrder.is_delivered ? `Đã giao (${selectedOrder.delivered_at})` : 'Chưa giao'}</p>
        <p><span className="font-semibold">Địa chỉ:</span> {selectedOrder.shipping_address}</p>
      </div>

      <h4 className="text-lg font-bold mb-2">Sản phẩm trong đơn</h4>
      <div className="space-y-4">
        {selectedOrder.order_items?.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center border rounded p-4 gap-4">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p>Số lượng: {item.qty}</p>
              <p>Giá: {item.price.toLocaleString('vi-VN')}₫</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

    </div>
  )
}
