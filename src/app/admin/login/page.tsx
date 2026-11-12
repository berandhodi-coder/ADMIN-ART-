import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    const supabase = createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) redirect('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <form action={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-[#18181b] p-8">
        <h1 className="text-2xl font-bold text-center text-white">Art Bouquet Admin</h1>
        <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20" />
        <button type="submit" className="w-full rounded-lg bg-white py-2 font-semibold text-black hover:bg-zinc-200 transition">Se connecter</button>
      </form>
    </div>
  );
}
