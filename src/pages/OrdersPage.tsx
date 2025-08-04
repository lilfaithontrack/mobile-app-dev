import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../services/api';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.getMyOrders();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case OrderStatus.ACCEPTED:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case OrderStatus.PICKED_UP:
        return <Package className="w-5 h-5 text-purple-500" />;
      case OrderStatus.IN_PROGRESS:
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.ACCEPTED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PICKED_UP:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Order Placed';
      case OrderStatus.ACCEPTED:
        return 'Accepted';
      case OrderStatus.PICKED_UP:
        return 'Picked Up';
      case OrderStatus.IN_PROGRESS:
        return 'In Progress';
      case OrderStatus.COMPLETED:
        return 'Completed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-fade-in">
        <div className="bg-primary safe-top relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20"></div>
          <div className="container py-6">
            <h1 className="text-white text-xl font-bold">My Orders</h1>
          </div>
        </div>
        <div className="container pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 mb-4 shadow-lg skeleton">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-primary safe-top relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20"></div>
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-bold">My Orders</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 haptic-light"
            >
              <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="container pt-6 pb-20">
        {orders.length === 0 ? (
          <div className="text-center py-12 animate-slide-up">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No orders yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start by placing your first laundry order</p>
            <button className="btn btn-primary btn-lg haptic-medium">
              <span className="font-semibold">Browse Services</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 haptic-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-gray-900">Order #{order.id.slice(-6)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-semibold">{order.service_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-primary text-lg">{order.subtotal} ETB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="text-gray-900 font-medium">{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Pickup:</strong> {order.pickup_address}
                  </div>
                  {order.delivery && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Delivery:</strong> {order.delivery_address}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    <strong>Items:</strong> {order.items?.length || 0} item(s)
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 btn btn-ghost btn-sm haptic-light">
                    <span className="font-medium">View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  {order.status === OrderStatus.PENDING && (
                    <button className="btn btn-secondary btn-sm haptic-light">
                      <span className="font-medium">Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;