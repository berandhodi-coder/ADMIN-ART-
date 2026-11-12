import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const ERRORS: Record<string, string> = {
  invalid: 'Email ou mot de passe incorrect.',
  forbidden: "Ce compte n'a pas accès à l'administration.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function signIn(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    });

    if (authError) redirect('/admin/login?error=invalid');

    if (data.user?.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      redirect('/admin/login?error=forbidden');
    }

    redirect('/admin/orders');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4">
      <form
        action={signIn}
        className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-[#18181b] p-8"
      >
        <h1 className="text-center text-2xl font-bold text-white">Art Bouquet Admin</h1>

        {error && ERRORS[error] && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {ERRORS[error]}
          </p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-white py-2 font-semibold text-black transition hover:bg-zinc-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
