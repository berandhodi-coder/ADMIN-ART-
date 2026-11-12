import { requireAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <aside className="w-64 border-r border-white/10 bg-[#18181b] p-6">
        <h1 className="mb-8 text-xl font-bold text-white">Art Bouquet</h1>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block rounded-lg px-4 py-2 text-zinc-400 hover:bg-white/5 hover:text-white">Dashboard</Link>
          <Link href="/admin/orders" className="block rounded-lg px-4 py-2 text-zinc-400 hover:bg-white/5 hover:text-white">Commandes</Link>
          <Link href="/admin/products" className="block rounded-lg px-4 py-2 text-zinc-400 hover:bg-white/5 hover:text-white">Produits</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
