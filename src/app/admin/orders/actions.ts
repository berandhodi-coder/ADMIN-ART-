'use server';

import { revalidatePath } from 'next/cache';
import { createClient, requireAdmin } from '@/lib/supabase/server';
import { ORDER_STATUSES, type OrderStatus } from '@/types';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  if (!ORDER_STATUSES.includes(status)) {
    throw new Error('Statut invalide');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
}
