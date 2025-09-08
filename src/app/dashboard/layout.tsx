// src/app/dashboard/layout.tsx
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Ambil data user dari sesi
  // Middleware sudah handle redirect, jadi di sini kita asumsikan user sudah login
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2A47] via-[#151B2E] to-[#0F1320] text-white">
      <Navbar user={user} />
      <main className="pt-24"> {/* Padding top agar konten tidak tertutup navbar */}
        {children}
      </main>
    </div>
  );
}