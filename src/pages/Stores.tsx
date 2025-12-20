export default function Stores() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cửa Hàng</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Chi nhánh Quận 1</h2>
          <p className="text-gray-700 mb-2">123 Đường ABC, Quận 1, TP.HCM</p>
          <p className="text-gray-600">Điện thoại: 0123 456 789</p>
          <p className="text-gray-600">Giờ mở cửa: 8:00 - 21:00 hàng ngày</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Chi nhánh Quận 3</h2>
          <p className="text-gray-700 mb-2">456 Đường XYZ, Quận 3, TP.HCM</p>
          <p className="text-gray-600">Điện thoại: 0123 456 790</p>
          <p className="text-gray-600">Giờ mở cửa: 8:00 - 21:00 hàng ngày</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Chi nhánh Bình Thạnh</h2>
          <p className="text-gray-700 mb-2">789 Đường DEF, Bình Thạnh, TP.HCM</p>
          <p className="text-gray-600">Điện thoại: 0123 456 791</p>
          <p className="text-gray-600">Giờ mở cửa: 8:00 - 21:00 hàng ngày</p>
        </div>
      </div>
    </div>
  );
}
