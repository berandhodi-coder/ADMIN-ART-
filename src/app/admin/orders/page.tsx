import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { dayRange, todayInCasablanca } from '@/lib/dates';
import { ordersHref } from '@/lib/orders-url';
import { signOut } from '../actions';
import OrderCard from '@/components/admin/OrderCard';
import DayPicker from '@/components/admin/DayPicker';
import RealtimeOrders from '@/components/admin/RealtimeOrders';
import { CITIES, ORDER_STATUSES, STATUS_LABELS, type Order } from '@/types';

type SearchParams = Promise<{ day?: string; city?: string; status?: string }>;

const fmt = (n: number) => n.toLocaleString('fr-FR');

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const day = sp.day && /^\d{4}-\d{2}-\d{2}$/.test(sp.day) ? sp.day : todayInCasablanca();
  const city = sp.city && (CITIES as readonly string[]).includes(sp.city) ? sp.city : 'all';
  const status =
    sp.status && (ORDER_STATUSES as readonly string[]).includes(sp.status) ? sp.status : 'all';

  const { start, end } = dayRange(day);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(product_name, quantity, unit_price_mad)')
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: false })
    .limit(200);

  const all = (data ?? []) as Order[];

  // Les commandes annulées ne comptent pas dans les totaux.
  const active = all.filter((o) => o.status !== 'annule');
  const cashToCollect = active.reduce((sum, o) => sum + Number(o.total_mad), 0);
  const newCount = all.filter((o) => o.status === 'nouveau').length;

  const perCity = CITIES.map((c) => {
    const list = active.filter((o) => o.city === c);
    return { city: c, count: list.length, total: list.reduce((s, o) => s + Number(o.total_mad), 0) };
  });

  const visible = all.filter(
    (o) => (city === 'all' || o.city === city) && (status === 'all' || o.status === status)
  );

  const chipBase = 'whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px]';
  const chipOn = 'border-green-500/40 bg-green-500/15 text-green-300';
  const chipOff = 'border-white/10 text-zinc-400 hover:bg-white/5';

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* En-tête */}
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-white">Commandes</h1>
          <p className="text-xs text-zinc-500">Art Bouquet, admin</p>
        </div>
        <div className="flex items-center gap-2">
          <DayPicker day={day} city={city} status={status} />
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Déconnexion"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white md:hidden"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </header>

      {/* Alerte "Nouvelle commande" en temps réel */}
      <RealtimeOrders />

      {/* Résumé du jour */}
      <section className="grid grid-cols-3 gap-2" aria-label="Résumé du jour">
        <div className="rounded-lg bg-[#18181b] p-2.5">
          <p className="text-[11px] text-zinc-500">Commandes</p>
          <p className="text-xl font-medium text-white">{active.length}</p>
        </div>
        <div className="rounded-lg bg-[#18181b] p-2.5">
          <p className="text-[11px] text-zinc-500">À encaisser</p>
          <p className="text-xl font-medium text-white">{fmt(cashToCollect)}</p>
        </div>
        <div className="rounded-lg bg-[#18181b] p-2.5">
          <p className="text-[11px] text-zinc-500">Nouvelles</p>
          <p className="text-xl font-medium text-white">{newCount}</p>
        </div>
      </section>

      {/* Par ville */}
      <p className="mb-1.5 mt-4 text-xs text-zinc-500">Par ville</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <Link href={ordersHref({ day, status })} className={`${chipBase} ${city === 'all' ? chipOn : chipOff}`}>
          Toutes {active.length}
        </Link>
        {perCity.map((c) => (
          <Link
            key={c.city}
            href={ordersHref({ day, city: c.city, status })}
            className={`${chipBase} ${city === c.city ? chipOn : chipOff}`}
          >
            {c.city} {c.count} · {fmt(c.total)}
          </Link>
        ))}
      </div>

      {/* Filtre par statut */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {['all', ...ORDER_STATUSES].map((s) => (
          <Link
            key={s}
            href={ordersHref({ day, city, status: s })}
            className={`rounded-md border px-2.5 py-1 text-xs whitespace-nowrap ${
              s === status ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-zinc-500 hover:bg-white/5'
            }`}
          >
            {s === 'all' ? 'Tous les statuts' : STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
          </Link>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          Impossible de charger les commandes : {error.message}
        </p>
      )}

      {/* Liste des commandes */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {visible.length === 0 && !error && (
        <p className="mt-10 text-center text-sm text-zinc-500">Aucune commande pour ce jour.</p>
      )}
    </div>
  );
}
