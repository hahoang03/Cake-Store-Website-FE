import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

interface OrderItem {
  id: string;
  product_id: string;
  qty: number;
  price: number;
  name: string;
  image: string;
}

interface OrderDetailType {
  id: string;
  user_id: string;
  payment_method: string;
  items_price: number;
  tax_price: number;
  shipping_price: number;
  total_price: number;
  is_paid: boolean;
  paid_at?: string | null;
  is_delivered: boolean;
  delivered_at?: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  order_items: OrderItem[];
  users?: { id: string; name: string; email: string };
}

interface ReviewType {
  id: string;
  product_id: string;
  user_id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetail() {
  const { user, loading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState('');

  // Modal review state
  const [activeReviewItem, setActiveReviewItem] = useState<OrderItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [userReview, setUserReview] = useState<ReviewType | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải chi tiết đơn hàng');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [user, id]);

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (loadingOrder) return <p>Đang tải chi tiết đơn hàng...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>Đơn hàng không tồn tại</p>;

  const openReviewModal = async (item: OrderItem) => {
    setActiveReviewItem(item);
    try {
      // Lấy review của user hiện tại
      const res = await api.get(`/api/reviews/product/${item.product_id}`);
      const review =
        res.data.data.find(
          (r: ReviewType) => r.user_id === user.id
        ) || null; setUserReview(review);
      setReviewRating(review?.rating || 5);
      setReviewComment(review?.comment || '');
    } catch (err) {
      console.error('Không thể tải review cũ', err);
      setUserReview(null);
      setReviewRating(5);
      setReviewComment('');
    }
  };

  const closeReviewModal = () => {
    setActiveReviewItem(null);
    setUserReview(null);
    setReviewRating(5);
    setReviewComment('');
  };

  const submitReview = async () => {
    if (!activeReviewItem) return;
    try {
      if (userReview?.id) {
        // Sửa review
        await api.put(`/api/reviews/${userReview.id}`, {
          rating: reviewRating,
          comment: reviewComment,
        });
        alert('Cập nhật review thành công');
      } else {
        // Tạo review mới
        await api.post(`/api/reviews`, {
          product_id: activeReviewItem.product_id,
          user_id: user.id,
          rating: reviewRating,
          comment: reviewComment,
          name: user.name,
        });
        alert('Tạo review thành công');
      }

      // Refresh review trong modal
      const res = await api.get(`/api/reviews/product/${activeReviewItem.product_id}`);
      const review = res.data.data.find(
        (r: ReviewType) => r.user_id === user.id
      ) || null;
      setUserReview(review);
      setReviewRating(review?.rating || 5);
      setReviewComment(review?.comment || '');
      closeReviewModal();
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi gửi review');
    }
  };

  const deleteReview = async () => {
    if (!userReview?.id) return;
    try {
      await api.delete(`/api/reviews/${userReview.id}`);
      alert('Xóa review thành công');
      setUserReview(null);
      setReviewRating(5);
      setReviewComment('');
      closeReviewModal();
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi xóa review');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chi tiết đơn hàng</h1>

      <div className="border rounded p-4 mb-6">
        <p><span className="font-semibold">Mã đơn:</span> {order.id}</p>
        <p><span className="font-semibold">Người đặt:</span> {order.users?.name || 'Khách'}</p>
        <p><span className="font-semibold">Tổng tiền:</span> {order.total_price.toLocaleString('vi-VN')}₫</p>
        <p>
          <span className="font-semibold">Thanh toán:</span>{' '}
          {order.is_paid ? `Đã thanh toán (${order.paid_at ? new Date(order.paid_at).toLocaleString('vi-VN') : ''})` : 'Chưa thanh toán'}
        </p>
        <p>
          <span className="font-semibold">Giao hàng:</span>{' '}
          {order.is_delivered ? `Đã giao (${order.delivered_at ? new Date(order.delivered_at).toLocaleString('vi-VN') : ''})` : 'Chưa giao'}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Các sản phẩm</h2>
      <div className="space-y-4">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center border rounded p-4 gap-4">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p>Số lượng: {item.qty}</p>
              <p>Giá: {item.price.toLocaleString('vi-VN')}₫</p>
              <p>Giá Ship: {order.shipping_price.toLocaleString('vi-VN')}₫</p>
              <p>Thuế: {order.tax_price.toLocaleString('vi-VN')}₫</p>
              <p>Tổng: {order.total_price.toLocaleString('vi-VN')}₫</p>

              {order.is_paid && order.is_delivered && (
                <button
                  onClick={() => openReviewModal(item)}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Đánh giá sản phẩm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal review */}
      {activeReviewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{activeReviewItem.name} - Quản lý đánh giá</h3>

            {userReview ? (
              <div className="mb-4">
                <p className="mb-1"><strong>Review hiện tại của bạn:</strong></p>
                <p>Điểm: {userReview.rating}</p>
                <p>Nhận xét: {userReview.comment}</p>
              </div>
            ) : (
              <p className="mb-4 text-gray-500">Bạn chưa có review nào cho sản phẩm này.</p>
            )}

            <label className="block mb-2">
              Điểm (1-5):
              <input
                type="number"
                min={1}
                max={5}
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16 ml-2"
              />
            </label>

            <label className="block mb-4">
              Nhận xét:
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>

            <div className="flex justify-end gap-2">
              {userReview && (
                <button
                  onClick={deleteReview}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              )}
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Lưu
              </button>
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to="/my-orders" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    </div>
  );
}
