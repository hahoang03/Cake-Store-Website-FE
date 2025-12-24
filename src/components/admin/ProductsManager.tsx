import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Category = {
  id: string
  name: string
  description?: string
}

type Product = {
  id: string
  name: string
  price: number
  image: string
  brand: string
  category_id: string
  count_in_stock: number
  description: string
  sold_qty: number
  is_active: boolean
  categories?: Category
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [creatingProduct, setCreatingProduct] = useState<Partial<Product> | null>(null)

  // Load categories trước
  useEffect(() => {
    fetchCategories()
  }, [])

  // Khi categories đã load xong, fetch products và map category
  useEffect(() => {
    if (categories.length) {
      fetchProducts()
    }
  }, [categories])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories')
      setCategories(res.data.data || [])
    } catch (err) {
      console.error('Load categories error:', err)
      setCategories([])
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products')
      const productsData: Product[] = res.data.data || []
      const productsWithCategory = productsData.map(p => ({
        ...p,
        categories: categories.find(c => c.id === p.category_id)
      }))
      setProducts(productsWithCategory)
    } catch (err) {
      console.error('Load products error:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (product: Partial<Product>) => {
    try {
      setSaving(true)
      const payload = {
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category_id: product.category_id,
        count_in_stock: product.count_in_stock,
        description: product.description,
        is_active: product.is_active,
      }
      if (!product.name || product.price == null || !product.category_id) {
        alert('Tên, giá và danh mục là bắt buộc.')
        return
      }
      const res = await api.post('/api/products', product)
      if (res.data && res.data.data) {
        const newProduct = {
          ...res.data.data,
          categories: categories.find(c => c.id === res.data.data.category_id),
        }
        setProducts(prev => [...prev, newProduct])
      }
      setCreatingProduct(null)
    } catch (err) {
      console.error('Create product error:', err)
      alert('Tạo sản phẩm thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      setSaving(true)
      const payload = {
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category_id: product.category_id,
        count_in_stock: product.count_in_stock,
        description: product.description,
        is_active: product.is_active,
      }
      const res = await api.put(`/api/products/${id}`, payload)
      if (res.data && res.data.data) {
        const updatedProduct = {
          ...res.data.data,
          categories: categories.find(c => c.id === res.data.data.category_id),
          sold_qty: products.find(p => p.id === id)?.sold_qty ?? 0
        }
        setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)))
        setEditingProduct(null)
      }
    } catch (err) {
      console.error(`Update product ${id} error:`, err)
      alert('Cập nhật thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      const res = await api.delete(`/api/products/${id}`)

      if (res.data?.deleted) {
        // Hard delete → remove khỏi state
        setProducts(prev => prev.filter(p => p.id !== id))
      } else if (res.data?.soft_deleted) {
        // Soft delete → đánh dấu inactive
        setProducts(prev =>
          prev.map(p =>
            p.id === id ? { ...p, is_active: false } : p
          )
        )
      }

      alert(res.data?.message || 'Xóa sản phẩm thành công.')
    } catch (err) {
      console.error(`Delete product ${id} error:`, err)
      alert('Xóa thất bại.')
    }
  }


  const toggleActive = async (id: string, currentValue: boolean) => {
    try {
      setSaving(true)
      const res = await api.put(`/api/products/${id}`, { is_active: !currentValue })
      if (res.data && res.data.data) {
        const updatedProduct = {
          ...res.data.data,
          categories: categories.find(c => c.id === res.data.data.category_id),
          sold_qty: products.find(p => p.id === id)?.sold_qty ?? 0
        }
        setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)))
      }
    } catch (err) {
      console.error(`Toggle active ${id} error:`, err)
      alert('Cập nhật trạng thái thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Đang tải sản phẩm...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Hình</th>
            <th className="p-2 text-left">Tên</th>
            <th className="p-2 text-left">Thương hiệu</th>
            <th className="p-2 text-left">Giá</th>
            <th className="p-2 text-left">Số lượng</th>
            <th className="p-2 text-left">Đã bán</th>
            <th className="p-2 text-left">Danh mục</th>
            <th className="p-2 text-left">Mô tả</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">{p.price} ₫</td>
              <td className="p-2">{p.count_in_stock}</td>
              <td className="p-2">{p.sold_qty ?? 0}</td>
              <td className="p-2">{p.categories?.name || '-'}</td>
              <td className="p-2" style={{ whiteSpace: 'pre-line' }}>{p.description}</td>


              <td className="p-2 flex gap-2">
                <button className="text-blue-500" onClick={() => setEditingProduct({ ...p })}>
                  Sửa
                </button>

                {/* Chỉ hiện nút Xóa khi sold_qty === 0 */}
                {p.sold_qty === 0 && (
                  <button className="text-red-500" onClick={() => deleteProduct(p.id)}>
                    Xóa
                  </button>
                  
                )}

                {/* Luôn hiện nút Ẩn */}
                {p.is_active && (
                  <button className="text-yellow-500" onClick={() => toggleActive(p.id, p.is_active)}>
                    Ẩn
                  </button>
                )}

                {/* Nếu sản phẩm đã inactive thì nút Hiện */}
                {!p.is_active && (
                  <button className="text-yellow-500" onClick={() => toggleActive(p.id, p.is_active)}>
                    Hiện
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() =>
          setCreatingProduct({
            name: '',
            price: 0,
            image: '',
            brand: '',
            category_id: '',
            count_in_stock: 0,
            description: '',
            is_active: true,
          })
        }
      >
        Thêm sản phẩm
      </button>

      {/* --- Modal Create --- */}
      {creatingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h3>

            <label className="block mb-2">
              Tên:
              <input
                type="text"
                value={creatingProduct.name || ''}
                onChange={(e) =>
                  setCreatingProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Thương hiệu:
              <input
                type="text"
                value={creatingProduct.brand || ''}
                onChange={(e) =>
                  setCreatingProduct((prev) => ({ ...prev, brand: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Giá:
              <input
                type="text"
                value={creatingProduct.price ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d*$/.test(val)) {
                    setCreatingProduct(prev => ({
                      ...prev,
                      price: val === '' ? undefined : Number(val)
                    }))
                  }
                }}
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Hình ảnh URL:
              <input
                type="text"
                value={creatingProduct.image || ''}
                onChange={(e) =>
                  setCreatingProduct((prev) => ({ ...prev, image: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Số lượng:
              <input
                type="text"
                value={creatingProduct.count_in_stock ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d*$/.test(val)) {
                    setCreatingProduct(prev => ({
                      ...prev,
                      count_in_stock: val === '' ? undefined : Number(val)
                    }))
                  }
                }}
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Mô tả:
              <textarea
                value={creatingProduct.description || ''}
                onChange={(e) =>
                  setCreatingProduct((prev) => ({ ...prev, description: e.target.value }))
                }
                className="border p-1 rounded w-full"
                rows={5}
              />
            </label>

            <label className="block mb-4">
              Danh mục:
              <select
                value={creatingProduct.category_id || ''}
                onChange={(e) =>
                  setCreatingProduct((prev) => ({ ...prev, category_id: e.target.value }))
                }
                className="border p-1 rounded w-full"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setCreatingProduct(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => creatingProduct && createProduct(creatingProduct)}
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Edit --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4">Sửa sản phẩm</h3>

            <label className="block mb-2">
              Tên:
              <input
                type="text"
                value={editingProduct.name || ''}
                onChange={(e) =>
                  setEditingProduct(prev => ({ ...prev, name: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Thương hiệu:
              <input
                type="text"
                value={editingProduct.brand || ''}
                onChange={(e) =>
                  setEditingProduct(prev => ({ ...prev, brand: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Giá:
              <input
                type="text"
                value={editingProduct.price ?? ''}
                onChange={e => {
                  const val = e.target.value
                  if (/^\d*$/.test(val)) {
                    setEditingProduct(prev => ({
                      ...prev,
                      price: val === '' ? undefined : Number(val)
                    }))
                  }
                }}
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Hình ảnh URL:
              <input
                type="text"
                value={editingProduct.image || ''}
                onChange={e =>
                  setEditingProduct(prev => ({ ...prev, image: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Số lượng:
              <input
                type="text"
                value={editingProduct.count_in_stock ?? ''}
                onChange={e => {
                  const val = e.target.value
                  if (/^\d*$/.test(val)) {
                    setEditingProduct(prev => ({
                      ...prev,
                      count_in_stock: val === '' ? undefined : Number(val)
                    }))
                  }
                }}
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-2">
              Mô tả:
              <textarea
                value={editingProduct.description || ''}
                onChange={e =>
                  setEditingProduct(prev => ({ ...prev, description: e.target.value }))
                }
                className="border p-1 rounded w-full"
                rows={5}
              />
            </label>

            <label className="block mb-4">
              Danh mục:
              <select
                value={editingProduct.category_id || ''}
                onChange={e =>
                  setEditingProduct(prev => ({ ...prev, category_id: e.target.value }))
                }
                className="border p-1 rounded w-full"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditingProduct(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() =>
                  editingProduct.id && updateProduct(editingProduct.id, editingProduct)
                }
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
