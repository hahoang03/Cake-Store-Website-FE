import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liên Hệ</h1>

      {/* Thông tin liên hệ */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex items-start gap-4">
          <Phone className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <div className="font-semibold text-gray-800">Điện thoại</div>
            <div className="text-gray-600">0123 456 789</div>
          </div>
        </div>
        <div className="flex-1 flex items-start gap-4">
          <Mail className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <div className="font-semibold text-gray-800">Email</div>
            <div className="text-gray-600">contact@tiembanhH&T.vn</div>
          </div>
        </div>
        <div className="flex-1 flex items-start gap-4">
          <MapPin className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <div className="font-semibold text-gray-800">Địa chỉ</div>
            <div className="text-gray-600">123 Đường ABC, TP.HCM</div>
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <div className="rounded-lg overflow-hidden">
        <iframe
          title="Tiệm bánh H&T"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125401.87125072783!2d106.61584510901548!3d10.825964118368729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175274c3991b3f9%3A0x7e07f4bf6d057e52!2sHT%20Coffee%26Cake!5e0!3m2!1svi!2s!4v1766491734497!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
