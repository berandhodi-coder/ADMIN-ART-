import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Order } from '@/types';

type RecentOrder = Pick<Order, 'id' | 'reference' | 'customer_name' | 'total_mad' | 'status' | 'created_at'>;

export default async function DashboardPage() {
  const supabase = await createClient();

  const [totalOrders, newOrders, totalProducts, recent] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, reference, customer_name, total_mad, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const recentOrders = (recent.data ?? []) as RecentOrder[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total commandes" value={totalOrders.count ?? 0} icon="📦" color="bg-blue-500/10 text-blue-400" />
        <StatCard title="Nouvelles" value={newOrders.count ?? 0} icon="🆕" color="bg-yellow-500/10 text-yellow-400" />
        <StatCard title="Produits" value={totalProducts.count ?? 0} icon="🌸" color="bg-pink-500/10 text-pink-400" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#18181b] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Commandes récentes</h2>
        <div className="space-y-3">
          {recentOrders.length === 0 && <p className="text-sm text-zinc-500">Aucune commande pour le moment.</p>}
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-4">
              <div>
                <p className="font-medium text-white">{order.reference}</p>
                <p className="text-sm text-zinc-400">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{order.total_mad} MAD</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#18181b] p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
