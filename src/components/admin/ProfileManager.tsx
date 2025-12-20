import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Profile {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile');
      const userData = res.data.data; // lấy data từ API
      setProfile(userData);
      setFormData({ name: userData.name || '' }); // set tên hiện tại vào input
    } catch (error) {
      console.error(error);
      setMessage('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  /* ===== UPDATE PROFILE ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/api/auth/profile', { name: formData.name });
      setMessage('Cập nhật thông tin thành công!');
      fetchProfile(); // reload profile
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải thông tin...</p>;
  if (!profile) return <p className="text-center py-10">Không có dữ liệu</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

      {message && <p className={`mb-4 ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            disabled
            value={profile.email}
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Họ và tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-3 rounded"
            placeholder="Họ và tên"
          />
        </div>

        <p className="font-semibold">Quyền: {profile.is_admin ? 'Admin' : 'User'}</p>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#3E5D2A] text-white py-3 rounded font-bold"
        >
          {saving ? 'Đang lưu...' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
}
