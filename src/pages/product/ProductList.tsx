import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'

interface Product {
  id: string
  name: string
  image: string
  price: number
  category_id: string
  count_in_stock: number
}

interface Category {
  id: string
  name: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRecs, setLoadingRecs] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryName, setCategoryName] = useState('Tất cả sản phẩm')
  const [animate, setAnimate] = useState(false)

  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')

  /* =======================
      LOAD CATEGORIES
  ======================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories')
        setCategories(res.data.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  /* =======================
      LOAD PRODUCTS
  ======================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setAnimate(false)

        let allProducts: Product[] = []

        if (categoryId) {
          const res = await api.get(`/api/categories/${categoryId}/products`)
          allProducts = res.data.data || []

          const cat = categories.find((c) => c.id === categoryId)
          setCategoryName(cat ? cat.name : 'Danh mục')
        } else {
          for (const c of categories) {
            const r = await api.get(`/api/categories/${c.id}/products`)
            allProducts = allProducts.concat(r.data.data || [])
          }
          setCategoryName('Tất cả sản phẩm')
        }

        setProducts(allProducts)

        // trigger animation
        setTimeout(() => setAnimate(true), 50)
      } catch (err) {
        console.error(err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (categories.length > 0 || !categoryId) {
      fetchProducts()
    }
  }, [categoryId, categories])

  /* =======================
      LOAD RECOMMENDATIONS
  ======================= */
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true)
        const res = await api.get('/api/recommendations?limit=6')
        setRecommendations(res.data.data || [])
      } catch (err) {
        console.error(err)
        setRecommendations([])
      } finally {
        setLoadingRecs(false)
      }
    }
    fetchRecommendations()
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-br from-[#eef3ea] to-white">
      {/* ================= HERO ================= */}
      <div className="relative w-full h-[300px] md:h-[420px] mb-12 rounded-2xl overflow-hidden animate-fadeIn">
        <img
          src="https://cailonuong.com/wp-content/uploads/2025/11/COVER-WEB-2.png"
          alt="Danh mục sản phẩm"
          className="w-full h-full object-cover"
        />

        {categoryId && (
          <>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide drop-shadow-lg text-center px-4">
                {categoryName}
              </h1>
            </div>
          </>
        )}
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
        />
      </div>

      {/* ================= RECOMMENDATIONS ================= */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-5">Dành riêng cho bạn</h2>
        {loadingRecs ? (
          <p className="text-center text-gray-500 py-10">Đang tải gợi ý...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Chưa có gợi ý cho bạn</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((p, index) => (
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

                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2 min-h-[3rem]">
                    {p.name}
                  </h3>
                  <p className="text-orange-500 font-bold text-xl">
                    {p.price.toLocaleString('vi-VN')} ₫
                  </p>
                  <div className="mt-5">
                    <span
                      className={`inline-block px-5 py-2 text-sm rounded-full transition
                        ${p.count_in_stock > 0
                          ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                          : 'bg-gray-300 text-gray-600'}`}
                    >
                      {p.count_in_stock > 0 ? 'Xem chi tiết' : 'Tạm thời hết hàng'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRODUCTS ================= */}
      <h2 className="text-2xl font-bold mb-5">Tất cả sản phẩm</h2>
      {loading ? (
        <p className="text-center py-20 text-gray-500">Đang tải sản phẩm...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center py-20 text-gray-500">Không có sản phẩm nào</p>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {filteredProducts.map((p, index) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              style={{ transitionDelay: `${index * 80}ms` }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6 text-center">
                <h2 className="text-lg font-semibold mb-3 line-clamp-2 min-h-[3rem]">
                  {p.name}
                </h2>

                <p className="text-orange-500 font-bold text-xl">
                  {p.price.toLocaleString('vi-VN')} ₫
                </p>

                <div className="mt-5">
                  <span
                    className={`inline-block px-5 py-2 text-sm rounded-full transition
                    ${p.count_in_stock > 0
                        ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                        : 'bg-gray-300 text-gray-600'}`}
                  >
                    {p.count_in_stock > 0 ? 'Xem chi tiết' : 'Tạm thời hết hàng'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
