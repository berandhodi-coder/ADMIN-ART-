export type OrderStatus = 'nouveau' | 'confirme' | 'en_livraison' | 'livre' | 'annule';

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: { id: string; reference: string; customer_name: string; phone: string; city: string; address: string; card_message: string | null; subtotal_mad: number; delivery_fee_mad: number; total_mad: number; payment_method: string; status: OrderStatus; created_at: string; };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string; product_name: string; unit_price_mad: number; quantity: number; };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      products: {
        Row: { id: string; slug: string; collection_id: string | null; name: string; description: string | null; price_mad: number; image_url: string | null; is_active: boolean; created_at: string; };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
    };
  };
}
