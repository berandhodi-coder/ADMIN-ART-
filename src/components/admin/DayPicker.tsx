'use client';

import { useRouter } from 'next/navigation';
import { ordersHref } from '@/lib/orders-url';

export default function DayPicker({
  day,
  city,
  status,
}: {
  day: string;
  city: string;
  status: string;
}) {
  const router = useRouter();

  return (
    <input
      type="date"
      value={day}
      aria-label="Choisir le jour"
      onChange={(e) => {
        if (e.target.value) router.push(ordersHref({ day: e.target.value, city, status }));
      }}
      className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-300 [color-scheme:dark]"
    />
  );
}
