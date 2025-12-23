import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Star } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../lib/api'

interface Product {
  id: string
  name: string
  image: string
  brand?: string
  price: number
  category_id: string
  count_in_stock: number
  description: string
  rating: number
  num_reviews: number
}

interface Review {
  id: string
  user_id: string
  name: string
  rating: number
  comment: string
  created_at: string
}

interface Category {
  id: string
  name: string
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')


  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      try {
        // Product
        const res = await api.get(`/api/products/${id}`)
        const p = res.data.data
        setProduct(p)

        // Category
        if (p.category_id) {
          const catRes = await api.get(`/api/categories/${p.category_id}`)
          setCategory(catRes.data.data)
        }

        // Reviews
        const reviewRes = await api.get(`/api/reviews/product/${id}`)
        setReviews(reviewRes.data.data || [])

        // Related products
        const relatedRes = await api.get(
          `/api/categories/${p.category_id}/products`
        )

        setRelated(
          (relatedRes.data.data || []).filter(
            (rp: Product) => rp.id !== p.id
          )
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { redirect: `/product/${id}` } })
      return
    }
    if (!product) return

    const existingItem = items.find(i => i.productId === product.id)
    const totalQty = (existingItem?.quantity || 0) + quantity

    if (totalQty > product.count_in_stock) {
      alert(`Bạn chỉ có thể mua tối đa ${product.count_in_stock} sản phẩm này`)
      return
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity,
    })
  }

  const handleEditReview = (r: Review) => {
    setEditingReviewId(r.id)
    setEditRating(r.rating)
    setEditComment(r.comment)
  }

  const handleUpdateReview = async (reviewId: string) => {
    try {
      await api.put(`/api/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      })

      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId
            ? { ...r, rating: editRating, comment: editComment }
            : r
        )
      )

      setEditingReviewId(null)
    } catch (err) {
      console.error(err)
      alert('Không thể cập nhật review')
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xoá review này không?')) return

    try {
      await api.delete(`/api/reviews/${reviewId}`)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
    } catch (err) {
      console.error(err)
      alert('Không thể xoá review')
    }
  }



  if (loading) return <p className="text-center py-20">Đang tải...</p>
  if (!product) return <p className="text-center py-20">Không tìm thấy</p>

  const existingItem = items.find(i => i.productId === product.id)
  const maxQty = product.count_in_stock - (existingItem?.quantity || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        to="/"
        className="flex items-center gap-2 mb-8 text-gray-500 hover:text-black transition"
      >
        <ArrowLeft size={18} /> Quay lại
      </Link>

      {/* PRODUCT INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="flex justify-center">
          <img src={product.image} alt={product.name} className="rounded shadow" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {Array.from({ length: product.rating }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-gray-500">
              ({product.num_reviews} đánh giá)
            </span>
          </div>

          <p className="text-orange-500 text-3xl font-bold mb-6">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>

          <div className="space-y-2 text-gray-700 mb-6">
            <p><strong>Thương hiệu:</strong> {product.brand || 'Không có'}</p>
            <p>
              <strong>Sản phẩm còn lại:</strong>{' '}
              {product.count_in_stock > 0 ? (
                <span className="text-green-600">{product.count_in_stock}</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </p>
            <p>
              <strong>Danh mục:</strong> {category ? category.name : '-'}
            </p>
          </div>

          <p className="whitespace-pre-line mb-6">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100"
              disabled={product.count_in_stock === 0}
            >
              <Minus size={16} />
            </button>

            <span className="text-lg font-medium">{quantity}</span>

            <button
              onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
              className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100"
              disabled={product.count_in_stock === 0 || quantity >= maxQty}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.count_in_stock === 0 || maxQty === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${product.count_in_stock === 0 || maxQty === 0
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
          >
            {product.count_in_stock === 0 || maxQty === 0
              ? 'Tạm thời hết hàng'
              : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Đánh giá ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => {
              const isOwner = user && r.user_id === user.id
              const isEditing = editingReviewId === r.id

              return (
                <div key={r.id} className="border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <strong>{r.name}</strong>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    {isOwner && !isEditing && (
                      <div className="flex gap-3 text-sm">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEditReview(r)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteReview(r.id)}
                        >
                          Xoá
                        </button>
                      </div>
                    )}
                  </div>

                  {/* EDIT MODE */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <select
                        value={editRating}
                        onChange={e => setEditRating(Number(e.target.value))}
                        className="border rounded px-2 py-1"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} sao</option>
                        ))}
                      </select>

                      <textarea
                        value={editComment}
                        onChange={e => setEditComment(e.target.value)}
                        className="w-full border rounded p-2"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateReview(r.id)}
                          className="px-4 py-1 bg-orange-500 text-white rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="px-4 py-1 border rounded"
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">{r.comment}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold line-clamp-2 mb-2">{p.name}</h3>
                  <p className="text-orange-500 font-bold">
                    {p.price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
