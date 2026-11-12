export const ORDER_STATUSES = ['nouveau', 'confirme', 'en_livraison', 'livre', 'annule'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  nouveau: 'Nouveau',
  confirme: 'Confirmé',
  en_livraison: 'En livraison',
  livre: 'Livré',
  annule: 'Annulé',
};

export const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger'] as const;

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price_mad: number;
}

export interface Order {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  card_message: string | null;
  subtotal_mad: number;
  delivery_fee_mad: number;
  total_mad: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_mad: number;
  image_url: string | null;
  is_active: boolean;
}
