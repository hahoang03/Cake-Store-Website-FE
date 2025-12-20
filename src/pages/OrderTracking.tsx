// src/pages/OrderTracking.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at?: string | null;
  is_paid: boolean;
  paid_at?: string | null;
  is_delivered: boolean;
  delivered_at?: string | null;
}

export default function OrderTracking() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await api.get('/api/orders/my'); // chỉ lấy đơn của user hiện tại
        setOrders(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách đơn hàng');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

      {loadingOrders ? (
        <p>Đang tải danh sách đơn hàng...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="font-semibold">Mã đơn:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold">Ngày đặt:</span>{' '}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString('vi-VN')
                    : 'Chưa có'}
                </p>
                <p>
                  <span className="font-semibold">Tổng tiền:</span>{' '}
                  {order.total_price?.toLocaleString('vi-VN') || '0'}₫
                </p>
                <p>
                  <span className="font-semibold">Thanh toán:</span>{' '}
                  {order.is_paid
                    ? `Đã thanh toán (${order.paid_at ? new Date(order.paid_at).toLocaleString('vi-VN') : ''})`
                    : 'Chưa thanh toán'}
                </p>
                <p>
                  <span className="font-semibold">Giao hàng:</span>{' '}
                  {order.is_delivered
                    ? `Đã giao (${order.delivered_at ? new Date(order.delivered_at).toLocaleString('vi-VN') : ''})`
                    : 'Chưa giao'}
                </p>
              </div>
              <Link
  to={`/orders/${order.id}`}
  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
>
  Xem chi tiết
</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
