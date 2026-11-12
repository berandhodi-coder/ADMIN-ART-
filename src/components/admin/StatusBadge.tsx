import { STATUS_LABELS, type OrderStatus } from '@/types';

const BADGE_STYLES: Record<OrderStatus, string> = {
  nouveau: 'bg-yellow-500/20 text-yellow-400',
  confirme: 'bg-blue-500/20 text-blue-400',
  en_livraison: 'bg-purple-500/20 text-purple-400',
  livre: 'bg-green-500/20 text-green-400',
  annule: 'bg-red-500/20 text-red-400',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${BADGE_STYLES[status] ?? 'bg-zinc-500/20 text-zinc-400'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
