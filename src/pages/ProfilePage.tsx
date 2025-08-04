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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary safe-top">
        <div className="container py-6">
          <h1 className="text-white text-xl font-semibold">Profile</h1>
        </div>
      </div>

      <div className="container pt-6 pb-20">
        {/* User Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.full_name || 'User'}
              </h2>
              <p className="text-gray-600">
                {user?.role === 'user' ? 'Customer' : user?.role}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{user?.phone || 'No phone number'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{user?.email || 'No email address'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-xs text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">8</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600 mb-1">₹2.4k</div>
            <div className="text-xs text-gray-600">Saved</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                } ${index === 0 ? 'rounded-t-xl' : ''} ${
                  index === menuItems.length - 1 ? 'rounded-b-xl' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">WashLink Mobile</div>
            <div className="text-xs text-gray-500">Version 1.0.0</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-200 text-red-600 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;