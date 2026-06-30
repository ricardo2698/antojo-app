// ===== USUARIOS =====

export type UserRole = 'super_admin' | 'restaurant_admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  restaurantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== RESTAURANTE =====

export interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export type HeaderType = 'image' | 'text';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  phone: string;
  logo: string;
  bannerImage?: string;
  headerType: HeaderType;
  theme: RestaurantTheme;
  adminUserId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateRestaurantData = Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'> & {
  adminEmail: string;
  adminPassword: string;
  adminName: string;
};

export type UpdateRestaurantData = Partial<
  Omit<Restaurant, 'id' | 'slug' | 'adminUserId' | 'createdAt' | 'updatedAt'>
>;

// ===== CATEGORÍAS =====

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCategoryData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryData = Partial<Omit<Category, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>>;

// ===== PRODUCTOS =====

export interface Additional {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tag?: string;
  additionals: Additional[];
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductData = Partial<Omit<Product, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>>;

// ===== ESTADOS DE PEDIDO =====

export interface OrderStatus {
  id: string;
  restaurantId: string;
  name: string;
  code: string;
  color: string;
  sortOrder: number;
  isBase: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderStatusData = Omit<OrderStatus, 'id' | 'createdAt' | 'updatedAt'>;

// Estados base que se crean automáticamente al crear un restaurante
export const BASE_ORDER_STATUSES: Omit<OrderStatus, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Recibido', code: 'received', color: '#6b7280', sortOrder: 1, isBase: true, isActive: true },
  { name: 'Confirmado', code: 'confirmed', color: '#3b82f6', sortOrder: 2, isBase: true, isActive: true },
  { name: 'En preparación', code: 'preparing', color: '#f59e0b', sortOrder: 3, isBase: true, isActive: true },
  { name: 'Listo', code: 'ready', color: '#10b981', sortOrder: 4, isBase: true, isActive: true },
  { name: 'Entregado', code: 'delivered', color: '#059669', sortOrder: 5, isBase: true, isActive: true },
  { name: 'Cancelado', code: 'cancelled', color: '#ef4444', sortOrder: 6, isBase: true, isActive: true },
];

// ===== PEDIDOS =====

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  additionals: Additional[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  statusId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderData = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderData = Partial<Pick<Order, 'statusId' | 'notes'>>;
