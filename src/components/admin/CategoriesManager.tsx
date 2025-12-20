import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description: string;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [creatingCategory, setCreatingCategory] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories'); // GET không cần token
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Load categories failed:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Partial<Category>) => {
    try {
      setSaving(true);
      if (!category.name) {
        alert('Tên danh mục là bắt buộc.');
        setSaving(false);
        return;
      }
      const res = await api.post('/api/categories', category);
      if (res.data?.data) setCategories((prev) => [...prev, res.data.data]);
      setCreatingCategory(null);
    } catch (err) {
      console.error('Create category error:', err);
      alert('Tạo danh mục thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      setSaving(true);
      const res = await api.put(`/api/categories/${id}`, category);
      if (res.data?.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? res.data.data : c))
        );
        setEditingCategory(null);
      }
    } catch (err) {
      console.error(`Update category ${id} error:`, err);
      alert('Cập nhật thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(`Delete category ${id} error:`, err);
      alert('Xóa thất bại.');
    }
  };

  if (loading) return <div className="p-6">Đang tải danh mục...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách danh mục</h2>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
        onClick={() =>
          setCreatingCategory({ name: '', description: '' })
        }
      >
        <Plus className="w-4 h-4" /> Thêm danh mục
      </button>

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
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.description}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="text-blue-500"
                  onClick={() => setEditingCategory({ ...c })}
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

      {/* --- Modal Create --- */}
      {creatingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4">Thêm danh mục mới</h3>

            <label className="block mb-2">
              Tên:
              <input
                type="text"
                value={creatingCategory.name || ''}
                onChange={(e) =>
                  setCreatingCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-4">
              Mô tả:
              <textarea
                value={creatingCategory.description || ''}
                onChange={(e) =>
                  setCreatingCategory((prev) => ({ ...prev, description: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setCreatingCategory(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => creatingCategory && createCategory(creatingCategory)}
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Edit --- */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4">Sửa danh mục</h3>

            <label className="block mb-2">
              Tên:
              <input
                type="text"
                value={editingCategory.name || ''}
                onChange={(e) =>
                  setEditingCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <label className="block mb-4">
              Mô tả:
              <textarea
                value={editingCategory.description || ''}
                onChange={(e) =>
                  setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
                }
                className="border p-1 rounded w-full"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditingCategory(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => editingCategory.id && updateCategory(editingCategory.id, editingCategory)}
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
