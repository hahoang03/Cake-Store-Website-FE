import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryName, setCategoryName] = useState('Tất cả sản phẩm');

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Load products theo category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res;

        if (categoryId) {
          // fetch products theo category
          res = await api.get(`/api/categories/${categoryId}/products`);
          const cat = categories.find((c) => c.id === categoryId);
          setCategoryName(cat ? cat.name : 'Danh mục không xác định');
        } else {
          // fetch tất cả products
          let allProducts: Product[] = [];
          for (const c of categories) {
            const r = await api.get(`/api/categories/${c.id}/products`);
            allProducts = allProducts.concat(r.data.data || []);
          }
          res = { data: { data: allProducts } };
          setCategoryName('Tất cả sản phẩm');
        }

        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || !categoryId) {
      fetchProducts();
    }
  }, [categoryId, categories]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-4">
        <Link to="/">Trang chủ</Link> / <span>{categoryName}</span>
      </nav>

      {/* Search */}
      <div className="mb-6 w-full">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center py-20">Đang tải...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center py-20">Không có sản phẩm nào</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
                <p className="text-orange-500 font-bold">
                  {p.price.toLocaleString('vi-VN')} ₫
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

