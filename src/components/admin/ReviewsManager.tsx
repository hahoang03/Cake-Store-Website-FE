import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Review = {
  id: string
  product_id: string
  name: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  user_id?: string
}

export default function AdminReviewsManager() {
  const [productId, setProductId] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReviews = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/reviews/product/${productId}`)
      setReviews(res.data.data || [])
    } catch (err) {
      console.error('Load reviews error:', err)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await api.delete(`/api/reviews/${id}`)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Delete review error:', err)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý Reviews (Admin)</h2>

      {/* Nhập productId */}
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          type="text"
          placeholder="Nhập Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={fetchReviews}
        >
          Xem Reviews
        </button>
      </div>

      {loading ? (
        <div>Đang tải reviews...</div>
      ) : reviews.length === 0 ? (
        <div>Chưa có review nào cho sản phẩm này.</div>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Tên</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left">Comment</th>
              <th className="p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.rating}</td>
                <td className="p-2">{r.comment}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => deleteReview(r.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
