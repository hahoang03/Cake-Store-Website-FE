import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
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

      const data = res.data;
      setProfile(data);

      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
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
      await api.put('/api/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      setMessage('Cập nhật thông tin thành công!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!profile) return <p>Không có dữ liệu</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

      {message && <p className="mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input disabled value={profile.email} className="input" />

        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="Họ và tên"
        />

        <input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input"
          placeholder="Số điện thoại"
        />

        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="input"
          placeholder="Địa chỉ"
        />

        <button disabled={saving} className="btn-primary">
          {saving ? 'Đang lưu...' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
}
