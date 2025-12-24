import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, FolderTree, ShoppingBag, Star, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProductsManager from '../../components/admin/ProductsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import OrdersManager from '../../components/admin/OrdersManager';
import ReviewsManager from '../../components/admin/ReviewsManager';
import ProfileManager from '../../components/admin/ProfileManager';

type TabType = 'products' | 'categories' | 'orders' | 'reviews' | 'profile';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  // if (!profile?.is_admin) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <div className="text-center">
  //         <div className="text-xl text-gray-600 mb-4">
  //           Bạn không có quyền truy cập trang này
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const tabs = [
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'categories', label: 'Danh mục', icon: FolderTree },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Trị Viên</h1>
        <p className="text-gray-600 mt-2">Quản lý cửa hàng bánh của bạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            { tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-orange-500 text-orange-500'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'reviews' && <ReviewsManager />}
          {activeTab === 'profile' && <ProfileManager />}
        </div>
      </div>
    </div>
  );
}
