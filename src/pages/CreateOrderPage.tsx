import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Item, OrderItem } from '../services/api';
import { apiService } from '../services/api';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [needsDelivery, setNeedsDelivery] = useState(true);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await apiService.getItems();
      if (response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item: Item) => {
    const existingItem = selectedItems.find(si => si.product_id === item.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(si =>
        si.product_id === item.id
          ? { ...si, quantity: si.quantity + 1 }
          : si
      ));
    } else {
      const newOrderItem: OrderItem = {
        product_id: item.id,
        category_id: 1, // Default category
        quantity: 1,
        price: item.price,
        service_type: item.name
      };
      setSelectedItems([...selectedItems, newOrderItem]);
    }
  };

  const removeItem = (productId: number) => {
    const existingItem = selectedItems.find(si => si.product_id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(selectedItems.map(si =>
        si.product_id === productId
          ? { ...si, quantity: si.quantity - 1 }
          : si
      ));
    } else {
      setSelectedItems(selectedItems.filter(si => si.product_id !== productId));
    }
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemQuantity = (productId: number) => {
    const item = selectedItems.find(si => si.product_id === productId);
    return item ? item.quantity : 0;
  };

  const handleCreateOrder = async () => {
    if (!pickupAddress.trim()) {
      alert('Please enter pickup address');
      return;
    }

    if (needsDelivery && !deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please select at least one service');
      return;
    }

    setCreating(true);

    try {
      const orderData = {
        pickup_address: pickupAddress,
        delivery_address: needsDelivery ? deliveryAddress : pickupAddress,
        delivery: needsDelivery,
        items: selectedItems
      };

      const response = await apiService.createOrder(orderData);
      if (response.data) {
        alert('Order created successfully!');
        navigate('/orders');
      } else {
        alert(response.error || 'Failed to create order');
      }
    } catch (error) {
      alert('Error creating order. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary safe-top">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-semibold">Create Order</h1>
          </div>
        </div>
      </div>

      <div className="container pt-6 pb-20">
        {/* Address Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Addresses
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter pickup address"
                className="input"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="needsDelivery"
                checked={needsDelivery}
                onChange={(e) => setNeedsDelivery(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="needsDelivery" className="text-sm text-gray-700">
                I need delivery to a different address
              </label>
            </div>

            {needsDelivery && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  className="input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Select Services
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {item.price} ETB • {item.estimated_time}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'Express' ? 'bg-red-100 text-red-700' :
                        item.category === 'Premium' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={quantity === 0}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => addItem(item)}
                          className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {quantity > 0 && (
                        <span className="font-semibold text-primary">
                          {(item.price * quantity).toFixed(2)} ETB
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {selectedItems.map((item) => {
                const serviceItem = items.find(i => i.id === item.product_id);
                return (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span>{serviceItem?.name} x {item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} ETB</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{getTotalAmount().toFixed(2)} ETB</span>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Button */}
        <button
          onClick={handleCreateOrder}
          disabled={creating || selectedItems.length === 0 || !pickupAddress.trim()}
          className="btn btn-primary btn-full btn-lg"
        >
          {creating ? (
            <div className="animate-pulse">Creating Order...</div>
          ) : (
            `Create Order • ${getTotalAmount().toFixed(2)} ETB`
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateOrderPage;