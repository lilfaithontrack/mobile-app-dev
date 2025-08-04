import React from 'react';
import { LogOut, User, Phone, Mail, Settings, HelpCircle, Star, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      action: () => console.log('Settings'),
    },
    {
      icon: Star,
      label: 'Rate App',
      action: () => console.log('Rate App'),
    },
    {
      icon: Gift,
      label: 'Refer Friends',
      action: () => console.log('Refer Friends'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => console.log('Help'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-primary safe-top relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20"></div>
        <div className="container py-6">
          <h1 className="text-white text-xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="container pt-6 pb-20">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.full_name || 'User'}
              </h2>
              <p className="text-gray-600 font-medium">
                {user?.role === 'user' ? 'Customer' : user?.role}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900 font-medium">{user?.phone || 'No phone number'}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900 font-medium">{user?.email || 'No email address'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-slide-up">
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-gray-100 haptic-light">
            <div className="text-3xl font-bold text-primary mb-2">12</div>
            <div className="text-xs text-gray-600 font-medium">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-gray-100 haptic-light">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-xs text-gray-600 font-medium">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-gray-100 haptic-light">
            <div className="text-3xl font-bold text-yellow-600 mb-2">2.4k</div>
            <div className="text-xs text-gray-600 font-medium">ETB Saved</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 animate-slide-up">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors haptic-light ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                  index === menuItems.length - 1 ? 'rounded-b-2xl' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6 animate-slide-up">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1 font-semibold">WashLink Mobile</div>
            <div className="text-xs text-gray-500 font-medium">Version 1.0.0</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-200 text-red-600 py-5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors haptic-medium animate-slide-up"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;