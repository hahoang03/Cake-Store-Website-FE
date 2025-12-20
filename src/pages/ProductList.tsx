import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Product {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price: number;
  category_id: string;
  count_in_stock: number;
  description: string;
  rating: number;
  num_reviews: number;
  created_at: string;
  updated_at: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/products');
        setProducts(res.data.data || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Lọc sản phẩm theo search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="mb-6 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <p className="text-xl text-gray-600">Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Thanh search */}
      <div className="mb-6 w-full">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Grid sản phẩm */}
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
    </div>
  );
}
