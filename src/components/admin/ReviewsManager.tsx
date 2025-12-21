import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Star, Trash2 } from 'lucide-react'

/* ================= TYPES ================= */

interface Product {
  id: string
  name: string
  image: string
  price: number
  num_reviews: number
  rating: number
}

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  created_at: string
}

/* ================= COMPONENT ================= */

export default function AdminReviewsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products')
      setProducts(res.data.data || [])
    } catch (err) {
      console.error('Load products error:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async (product: Product) => {
    setSelectedProduct(product)
    setLoadingReviews(true)

    try {
      const res = await api.get(
        `/api/reviews/product/${product.id}`
      )
      setReviews(res.data.data || [])
    } catch (err) {
      console.error('Load reviews error:', err)
      setReviews([])
    } finally {
      setLoadingReviews(false)
    }
  }

  /* ================= DELETE REVIEW ================= */

  const deleteReview = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa review này?'))
      return

    try {
      await api.delete(`/api/reviews/${id}`)
      setReviews((prev) =>
        prev.filter((r) => r.id !== id)
      )
    } catch (err) {
      console.error('Delete review error:', err)
    }
  }

  /* ================= RENDER ================= */

  if (loading) {
    return <div className="p-6">Đang tải sản phẩm...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Quản lý Reviews
      </h2>

      {/* ===== PRODUCT TABLE ===== */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Hình</th>
            <th className="p-2 text-left">Sản phẩm</th>
            <th className="p-2 text-left">Rating</th>
            <th className="p-2 text-left">Reviews</th>
            <th className="p-2 text-left">Giá</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded"
                />
              </td>

              <td className="p-2 font-medium">
                {p.name}
              </td>

              <td className="p-2">
                ⭐ {p.rating}
              </td>

              <td className="p-2">
                {p.num_reviews}
              </td>
              <td className="p-2">
                {p.price.toLocaleString()} ₫
              </td>



              <td className="p-2">
                {p.num_reviews > 0 ? (
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => fetchReviews(p)}
                  >
                    Xem reviews
                  </button>
                ) : (
                  <span className="text-gray-400">
                    Chưa có review
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== REVIEWS MODAL ===== */}
      {selectedProduct && (
        <Modal
          title={selectedProduct.name}
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null)
            setReviews([])
          }}
        >
          {loadingReviews ? (
            <div>Đang tải reviews...</div>
          ) : reviews.length === 0 ? (
            <div>Không có review nào</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border p-4 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong>{r.name}</strong>
                        <div className="flex text-yellow-400">
                          {Array.from({
                            length: r.rating,
                          }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p>{r.comment}</p>
                    </div>

                    <button
                      className="text-red-500"
                      onClick={() =>
                        deleteReview(r.id)
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

/* ================= MODAL ================= */

function Modal({
  title,
  product,
  children,
  onClose,
}: {
  title: string
  product: Product
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[95vw] max-w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="text-xl font-bold">
                {title}
              </h3>
              <div className="text-sm text-gray-500">
                ⭐ {product.rating} | {product.num_reviews} reviews
              </div>
            </div>
          </div>

          <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
