import { createClient } from '@/lib/supabase/server';

export default async function OrdersPage({ searchParams }: { searchParams: { city?: string; status?: string } }) {
  const supabase = await createClient();
  const city = searchParams.city || 'all';
  const status = searchParams.status || 'all';

  let query = supabase
    .from('orders')
    .select('*, order_items(product_name, quantity, unit_price_mad)')
    .order('created_at', { ascending: false });

  if (city !== 'all') query = query.eq('city', city);
  if (status !== 'all') query = query.eq('status', status);

  const { data: orders } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Commandes</h1>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: any) {
  const date = new Date(order.created_at);
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-xl border border-white/10 bg-[#18181b] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono text-sm text-zinc-400">{order.reference}</span>
          <span className="ml-3 text-xs text-zinc-500">{time}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg text-white">{order.customer_name}</h3>
        <p className="text-sm text-zinc-400">{order.address}, {order.city}</p>
        <p className="text-sm text-zinc-500">📞 {order.phone}</p>
      </div>

      <div className="mb-4 space-y-1">
        {order.order_items?.map((item: any, idx: number) => (
          <p key={idx} className="text-sm text-zinc-300">{item.quantity} × {item.product_name}</p>
        ))}
      </div>

      {order.card_message && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-400">💬 Message: {order.card_message}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-400">Livraison: {order.delivery_fee_mad} MAD</span>
        <span className="font-bold text-lg text-white">{order.total_mad} MAD</span>
      </div>

      <div className="flex gap-2 mb-4">
        <a href={	el:} className="flex-1 rounded-lg bg-zinc-800 py-2 text-center text-sm text-white hover:bg-zinc-700">📞 Appeler</a>
        <a href={https://wa.me/212} target="_blank" className="flex-1 rounded-lg bg-zinc-800 py-2 text-center text-sm text-white hover:bg-zinc-700">💬 WhatsApp</a>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {['nouveau', 'confirme', 'en_livraison', 'livre'].map((s) => (
          <button key={s} className={py-2 rounded-lg text-xs font-medium }>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    nouveau: 'bg-yellow-500/20 text-yellow-400',
    confirme: 'bg-blue-500/20 text-blue-400',
    en_livraison: 'bg-purple-500/20 text-purple-400',
    livre: 'bg-green-500/20 text-green-400',
    annule: 'bg-red-500/20 text-red-400',
  };
  return <span className={inline-block rounded-full px-3 py-1 text-xs font-medium }>{status}</span>;
}
