export default function Loyalty() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Khách Hàng Thân Thiết</h1>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Chương trình thành viên</h2>
          <p className="text-gray-700 leading-relaxed">
            Trở thành thành viên của H&T để nhận được nhiều ưu đãi đặc biệt và tích điểm
            với mỗi lần mua hàng.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cấp độ thành viên</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-gray-400 pl-4">
              <h3 className="font-bold text-gray-800">Bạc</h3>
              <p className="text-gray-600">Giảm 5% cho mọi đơn hàng</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-bold text-gray-800">Vàng</h3>
              <p className="text-gray-600">Giảm 10% cho mọi đơn hàng + Quà tặng sinh nhật</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold text-gray-800">Kim cương</h3>
              <p className="text-gray-600">
                Giảm 15% cho mọi đơn hàng + Ưu tiên giao hàng + Quà tặng đặc biệt
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cách tích điểm</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Tích 1 điểm cho mỗi 10.000đ chi tiêu</li>
            <li>Tặng 50 điểm khi đăng ký thành viên mới</li>
            <li>Nhận điểm thưởng vào ngày sinh nhật</li>
            <li>Tích điểm khi giới thiệu bạn bè</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
