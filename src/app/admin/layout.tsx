import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { signOut } from './actions';

const NAV = [
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Produits' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#09090b] md:flex">
      {/* Menu latéral (ordinateur) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#18181b] p-6 md:flex">
        <h1 className="mb-8 text-xl font-bold text-white">Art Bouquet</h1>
        <nav className="flex-1 space-y-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2 text-left text-zinc-500 hover:bg-white/5 hover:text-white"
          >
            Déconnexion
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Menu horizontal (téléphone) */}
        <nav className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#18181b] px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
