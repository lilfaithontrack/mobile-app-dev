import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define all types locally to avoid import issues
interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

interface LoginRequest {
  phone_number: string;
  otp_code: string;
  full_name?: string;
}

interface OTPRequest {
  phone_number: string;
}

interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  is_active: boolean;
  estimated_time: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  product_id: number;
  category_id: number;
  quantity: number;
  price: number;
  service_type: string;
}

enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

interface Order {
  id: string;
  user_id: string;
  service_provider_id?: string;
  driver_id?: string;
  status: OrderStatus;
  service_type: string;
  subtotal: number;
  delivery: boolean;
  delivery_charge: number;
  pickup_address: string;
  delivery_address: string;
  created_at: string;
  items: OrderItem[];
}

interface CreateOrderRequest {
  pickup_address: string;
  delivery_address: string;
  delivery: boolean;
  items: OrderItem[];
  notes?: string;
}

interface APIResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Export types for use in other files
export type { User, Item, Order, OrderItem };
export { OrderStatus };

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.washlinnk.com/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async requestOTP(data: OTPRequest): Promise<APIResponse<{ otp: string }>> {
    try {
      const response: AxiosResponse = await this.api.post('/auth/request-otp', data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to send OTP' };
    }
  }

  async verifyOTP(data: LoginRequest): Promise<APIResponse<AuthResponse>> {
    try {
      const response: AxiosResponse = await this.api.post('/auth/verify-otp', data);
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Invalid OTP' };
    }
  }

  async logout(): Promise<APIResponse<{ message: string }>> {
    try {
      const response: AxiosResponse = await this.api.post('/auth/logout');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return { data: response.data };
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return { error: error.response?.data?.detail || 'Logout failed' };
    }
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    try {
      const response: AxiosResponse = await this.api.get('/users/me');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to get user info' };
    }
  }

  // Items endpoints
  async getItems(category?: string): Promise<APIResponse<Item[]>> {
    try {
      const params = category ? { category } : {};
      const response: AxiosResponse = await this.api.get('/items/public', { params });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to fetch items' };
    }
  }

  // Orders endpoints
  async createOrder(data: CreateOrderRequest): Promise<APIResponse<Order>> {
    try {
      const response: AxiosResponse = await this.api.post('/orders', data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to create order' };
    }
  }

  async getMyOrders(skip = 0, limit = 100): Promise<APIResponse<Order[]>> {
    try {
      const response: AxiosResponse = await this.api.get('/orders/my-orders', {
        params: { skip, limit }
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to fetch orders' };
    }
  }

  async getOrder(orderId: string): Promise<APIResponse<Order>> {
    try {
      const response: AxiosResponse = await this.api.get(`/orders/${orderId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.detail || 'Failed to fetch order' };
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
export default apiService;