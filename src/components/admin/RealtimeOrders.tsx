'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellRing } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Le navigateur peut bloquer le son tant que la page n'a pas reçu un clic.
  }
}

export default function RealtimeOrders() {
  const router = useRouter();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('orders-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const ref = (payload.new as { reference?: string }).reference ?? 'nouvelle commande';
          setReference(ref);
          beep();
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  useEffect(() => {
    if (!reference) return;
    const t = setTimeout(() => setReference(null), 10_000);
    return () => clearTimeout(t);
  }, [reference]);

  if (!reference) return null;

  return (
    <div
      role="status"
      className="mb-3 flex items-center gap-2 rounded-lg bg-green-500/15 px-3 py-2 text-sm text-green-400"
    >
      <BellRing size={16} aria-hidden="true" />
      <span>Nouvelle commande {reference}</span>
    </div>
  );
}
