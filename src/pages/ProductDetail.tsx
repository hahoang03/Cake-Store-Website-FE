import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

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
  name: string
  rating: number
  comment: string
  created_at: string
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      try {
        const res = await api.get(`/api/products/${id}`)
        setProduct(res.data.data)

        const reviewRes = await api.get(`/api/reviews/product/${id}`)
        setReviews(reviewRes.data.data || [])
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
      navigate('/login', {
        state: { redirect: `/products/${id}` },
      })
      return
    }

    if (!product) return

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity,
    })
  }

  if (loading) return <p className="text-center py-20">Đang tải...</p>
  if (!product) return <p className="text-center py-20">Không tìm thấy</p>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 mb-6 text-gray-600">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <img src={product.image} alt={product.name} className="rounded shadow" />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-orange-500 text-3xl font-bold mb-4">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>

          <p className="whitespace-pre-line">
            <strong>Mô tả:</strong> {product.description}
          </p>
          <p><strong>Thương hiệu:</strong> {product.brand || 'Không có'}</p>
          <p><strong>Số lượng:</strong> {product.count_in_stock}</p>



          <div className="flex items-center gap-3 my-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="border p-2"
            >
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              onClick={() =>
                setQuantity(q =>
                  Math.min(product.count_in_stock, q + 1)
                )
              }
              className="border p-2"
            >
              <Plus size={16} /> 
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-4 rounded font-bold"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
            

      {/* REVIEWS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Đánh giá ({reviews.length})
        </h2>

        {reviews.length === 0 && (
          <p className="text-gray-500">Chưa có đánh giá</p>
        )}

        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="border p-4 rounded">
              <div className="flex items-center gap-2 mb-1">
                <strong>{r.name}</strong>
                <div className="flex text-yellow-400">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

