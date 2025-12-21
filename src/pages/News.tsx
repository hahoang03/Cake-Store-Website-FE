export default function News() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tin Tức</h1>

      <div className="space-y-6">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg"
            alt="News"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">15/12/2024</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Ra mắt bộ sưu tập bánh Giáng Sinh 2024
            </h2>
            <p className="text-gray-700 leading-relaxed">
              H&T vui mừng giới thiệu bộ sưu tập bánh Giáng Sinh đặc biệt với nhiều
              hương vị mới lạ và thiết kế độc đáo. Đặt hàng sớm để nhận ưu đãi lên đến 20%.
            </p>
          </div>
        </article>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg"
            alt="News"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">01/12/2024</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Khai trương chi nhánh mới tại Bình Thạnh
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi rất vui mừng thông báo khai trương chi nhánh thứ 3 tại Bình Thạnh.
              Ghé thăm và nhận ngay ưu đãi 30% cho đơn hàng đầu tiên trong tuần khai trương.
            </p>
          </div>
        </article>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg"
            alt="News"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">20/11/2024</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Workshop làm bánh miễn phí cho khách hàng thân thiết
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tham gia workshop làm bánh cùng các đầu bếp chuyên nghiệp của Cái Lò Nướng.
              Dành riêng cho khách hàng thân thiết cấp Vàng và Kim cương.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
