import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liên Hệ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <div className="font-semibold text-gray-800">Điện thoại</div>
                <div className="text-gray-600">0123 456 789</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <div className="font-semibold text-gray-800">Email</div>
                <div className="text-gray-600">contact@cailonuong.vn</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <div className="font-semibold text-gray-800">Địa chỉ</div>
                <div className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Gửi tin nhắn</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tin nhắn</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
