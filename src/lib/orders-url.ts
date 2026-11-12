export function ordersHref(p: { day?: string; city?: string; status?: string }): string {
  const q = new URLSearchParams();
  if (p.day) q.set('day', p.day);
  if (p.city && p.city !== 'all') q.set('city', p.city);
  if (p.status && p.status !== 'all') q.set('status', p.status);
  const s = q.toString();
  return s ? `/admin/orders?${s}` : '/admin/orders';
}
