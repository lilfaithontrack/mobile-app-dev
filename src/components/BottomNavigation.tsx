import React from 'react';
import { Home, Package, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/orders',
      icon: Package,
      label: 'Orders',
    },
    {
      path: '/create-order',
      icon: Plus,
      label: 'New Order',
      isAction: true,
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="container px-0">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-h-[60px] rounded-lg transition-all ${
                  item.isAction
                    ? 'bg-primary text-white shadow-lg scale-110'
                    : isActive
                    ? 'bg-blue-50 text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-6 h-6 ${item.isAction ? 'w-7 h-7' : ''}`} />
                <span className={`text-xs mt-1 font-medium ${item.isAction ? 'text-xs' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;