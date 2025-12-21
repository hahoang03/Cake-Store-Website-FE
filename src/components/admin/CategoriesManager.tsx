import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  count_in_stock: number;
};

/* ================= COMPONENT ================= */

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] =
    useState<Partial<Category> | null>(null);
  const [creatingCategory, setCreatingCategory] =
    useState<Partial<Category> | null>(null);

  const [saving, setSaving] = useState(false);

  /* ====== PRODUCTS MODAL ====== */
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= API ================= */

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Load categories failed:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category: Category) => {
    try {
      setSelectedCategory(category);
      setLoadingProducts(true);

      const res = await api.get(
        `/api/categories/${category.id}/products`
      );
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Load products failed:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const createCategory = async (category: Partial<Category>) => {
    try {
      setSaving(true);
      if (!category.name) {
        alert('Tên danh mục là bắt buộc.');
        return;
      }

      const res = await api.post('/api/categories', category);
      if (res.data?.data) {
        setCategories((prev) => [...prev, res.data.data]);
      }
      setCreatingCategory(null);
    } catch (err) {
      console.error('Create category error:', err);
      alert('Tạo danh mục thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (
    id: string,
    category: Partial<Category>
  ) => {
    try {
      setSaving(true);
      const res = await api.put(
        `/api/categories/${id}`,
        category
      );

      if (res.data?.data) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === id ? res.data.data : c
          )
        );
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Update category error:', err);
      alert('Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      console.error('Delete category error:', err);
      alert('Xóa thất bại.');
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return <div className="p-6">Đang tải danh mục...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Quản lý danh mục
      </h2>

      {/* ===== ADD CATEGORY ===== */}
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
        onClick={() =>
          setCreatingCategory({ name: '', description: '' })
        }
      >
        <Plus className="w-4 h-4" />
        Thêm danh mục
      </button>

      {/* ===== CATEGORY TABLE ===== */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Tên</th>
            <th className="p-2 text-left">Mô tả</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td
                className="p-2 text-blue-600 cursor-pointer hover:underline"
                onClick={() => fetchProductsByCategory(c)}
              >
                {c.name}
              </td>
              <td className="p-2">{c.description}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="text-blue-500"
                  onClick={() =>
                    setEditingCategory({ ...c })
                  }
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteCategory(c.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CREATE MODAL ================= */}
      {creatingCategory && (
        <Modal title="Thêm danh mục">
          <CategoryForm
            category={creatingCategory}
            setCategory={setCreatingCategory}
            saving={saving}
            onCancel={() => setCreatingCategory(null)}
            onSave={() =>
              createCategory(creatingCategory)
            }
          />
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingCategory && (
        <Modal title="Sửa danh mục">
          <CategoryForm
            category={editingCategory}
            setCategory={setEditingCategory}
            saving={saving}
            onCancel={() => setEditingCategory(null)}
            onSave={() =>
              editingCategory.id &&
              updateCategory(
                editingCategory.id,
                editingCategory
              )
            }
          />
        </Modal>
      )}

      {/* ================= PRODUCTS MODAL ================= */}
      {selectedCategory && (
        <Modal
          title={`Bánh trong danh mục: ${selectedCategory.name}`}
          onClose={() => setSelectedCategory(null)}
        >
          {loadingProducts ? (
            <div>Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div>Không có sản phẩm nào</div>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">
                    Tên bánh
                  </th>
                  <th className="p-2 text-left">
                    Giá
                  </th>
                  <th className="p-2 text-left">
                    Số lượng
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t"
                  >
                    <td className="p-2">
                      {p.name}
                    </td>
                    <td className="p-2">
                      {p.price.toLocaleString()} đ
                    </td>
                    <td className="p-2">
                      {p.count_in_stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[700px] max-h-[90vh] overflow-y-auto shadow-lg">
        <h3 className="text-xl font-bold mb-4">
          {title}
        </h3>
        {children}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryForm({
  category,
  setCategory,
  saving,
  onCancel,
  onSave,
}: any) {
  return (
    <>
      <label className="block mb-2">
        Tên:
        <input
          className="border p-1 rounded w-full"
          value={category.name || ''}
          onChange={(e) =>
            setCategory((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </label>

      <label className="block mb-4">
        Mô tả:
        <textarea
          className="border p-1 rounded w-full"
          value={category.description || ''}
          onChange={(e) =>
            setCategory((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </label>

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </>
  );
}
