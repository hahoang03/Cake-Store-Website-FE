export default function Delivery() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Giao Hàng</h1>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Chính sách giao hàng</h2>
          <p className="text-gray-700 leading-relaxed">
            H&T cung cấp dịch vụ giao hàng tận nơi trong khu vực nội thành.
            Chúng tôi cam kết giao hàng nhanh chóng và đảm bảo chất lượng sản phẩm.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Thời gian giao hàng</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Giao hàng trong vòng 2-4 giờ cho đơn hàng đặt trước</li>
            <li>Giao hàng trong ngày cho đơn hàng đặt sáng sớm</li>
            <li>Có thể đặt lịch giao hàng theo yêu cầu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Phí giao hàng</h2>
          <p className="text-gray-700 leading-relaxed">
            Miễn phí giao hàng cho đơn hàng từ 200.000đ trở lên trong bán kính 5km.
            Phí giao hàng đồng giá 20.000đ trong nội thành TPHCM.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Khu vực giao hàng</h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi hiện đang giao hàng tại các quận nội thành TP.HCM.
            Vui lòng liên hệ để biết thêm chi tiết về khu vực giao hàng.
          </p>
        </section>
      </div>
    </div>
  );
}
