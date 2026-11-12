import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, price_mad, image_url, is_active')
    .order('created_at', { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Produits</h1>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Impossible de charger les produits : {error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#18181b]">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.name} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-zinc-900 text-zinc-600">Pas d'image</div>
            )}
            <div className="space-y-1 p-4">
              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="text-sm text-zinc-400">{p.price_mad} MAD</p>
              {!p.is_active && <p className="text-xs text-red-400">Masqué</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
