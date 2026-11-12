'use client';

import { useState, useTransition } from 'react';
import { MessageCircle, Pencil, Phone } from 'lucide-react';
import { updateOrderStatus } from '@/app/admin/orders/actions';
import { ORDER_STATUSES, STATUS_LABELS, type Order, type OrderStatus } from '@/types';

const CHIP_ON: Record<OrderStatus, string> = {
  nouveau: 'border-yellow-500/40 bg-yellow-500/15 text-yellow-300',
  confirme: 'border-blue-500/40 bg-blue-500/15 text-blue-300',
  en_livraison: 'border-purple-500/40 bg-purple-500/15 text-purple-300',
  livre: 'border-green-500/40 bg-green-500/15 text-green-300',
  annule: 'border-red-500/40 bg-red-500/15 text-red-300',
};
const CHIP_OFF = 'border-white/10 text-zinc-400 hover:bg-white/5';

// 06 12 34 56 78 ou +212612345678 -> 212612345678
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('212')) return digits;
  if (digits.startsWith('0')) return `212${digits.slice(1)}`;
  return digits;
}

export default function OrderCard({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const time = new Date(order.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  });

  function changeStatus(next: OrderStatus) {
    if (next === order.status) return;
    if (next === 'annule' && !window.confirm(`Annuler la commande ${order.reference} ?`)) return;

    setError(null);
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, next);
      } catch {
        setError('Impossible de changer le statut. Réessayez.');
      }
    });
  }

  return (
    <article
      className={`rounded-xl border border-white/10 bg-[#18181b] p-3.5 text-sm ${
        order.status === 'annule' ? 'opacity-60' : ''
      } ${isPending ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">{order.reference}</span>
        <span className="text-xs text-zinc-500">{time}</span>
      </div>

      <p className="mt-1 text-zinc-100">
        {order.customer_name} · {order.city}
      </p>
      <p className="text-xs text-zinc-500">
        {order.address} · {order.phone}
      </p>

      <div className="mt-2 space-y-0.5 text-[13px] text-zinc-300">
        {order.order_items?.map((item, idx) => (
          <p key={idx}>
            {item.quantity} × {item.product_name}
          </p>
        ))}
      </div>

      {order.card_message && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-1.5 text-xs text-yellow-400">
          <Pencil size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>Message : {order.card_message}</span>
        </div>
      )}

      <div className="mt-2 flex items-baseline justify-between text-[13px]">
        <span className="text-zinc-500">Livraison {order.delivery_fee_mad} MAD</span>
        <span className="font-medium text-white">{order.total_mad} MAD</span>
      </div>

      <div className="mt-2.5 flex gap-1.5">
        <a
          href={`tel:${order.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[13px] text-zinc-200 hover:bg-white/5"
        >
          <Phone size={15} aria-hidden="true" />
          Appeler
        </a>
        <a
          href={`https://wa.me/${toWhatsAppNumber(order.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[13px] text-zinc-200 hover:bg-white/5"
        >
          <MessageCircle size={15} aria-hidden="true" />
          WhatsApp
        </a>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={isPending}
            onClick={() => changeStatus(s)}
            className={`rounded-md border px-2 py-1 text-xs transition ${
              s === order.status ? CHIP_ON[s] : CHIP_OFF
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </article>
  );
}
