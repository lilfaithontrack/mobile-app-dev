// API Types based on the backend schemas

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface LoginRequest {
  phone_number: string;
  otp_code: string;
  full_name?: string;
}

export interface OTPRequest {
  phone_number: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

export interface Item {
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

export interface OrderItem {
  product_id: number;
  category_id: number;
  quantity: number;
  price: number;
  service_type: string;
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface Order {
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

export interface CreateOrderRequest {
  pickup_address: string;
  delivery_address: string;
  delivery: boolean;
  items: OrderItem[];
  notes?: string;
}

export interface APIResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}