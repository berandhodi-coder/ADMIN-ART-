import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const [{ count: totalOrders }, { count: newOrders }, { count: totalProducts }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ]);

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, reference, customer_name, total_mad, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Commandes" value={totalOrders || 0} icon="📦" color="bg-blue-500/10 text-blue-400" />
        <StatCard title="Nouvelles" value={newOrders || 0} icon="🆕" color="bg-yellow-500/10 text-yellow-400" />
        <StatCard title="Produits" value={totalProducts || 0} icon="🌸" color="bg-pink-500/10 text-pink-400" />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#18181b] p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Commandes récentes</h2>
        <div className="space-y-3">
          {recentOrders?.map((order) => (
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
    <div className={ounded-xl border border-white/10 bg-[#18181b] p-6 }>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
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
