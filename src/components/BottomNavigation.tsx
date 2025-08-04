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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 safe-bottom z-50">
      <div className="container px-0">
        <div className="flex items-center justify-around py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-h-[64px] rounded-2xl transition-all haptic-light ${
                  item.isAction
                    ? 'bg-primary text-white shadow-lg scale-110 animate-bounce'
                    : isActive
                    ? 'bg-gradient-to-t from-green-50 to-blue-50 text-primary scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform ${item.isAction ? 'w-7 h-7' : ''} ${isActive && !item.isAction ? 'scale-110' : ''}`} />
                <span className={`text-xs mt-1 font-semibold ${item.isAction ? 'text-xs' : ''} ${isActive ? 'font-bold' : ''}`}>
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