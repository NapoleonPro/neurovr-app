// src/app/test-supabase/page.tsx
'use client';
import { createClient } from '@/lib/supabase/client';

export default function TestSupabase() {
  const testConnection = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase test:', { data, error });
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  };

  return (
    <div className="p-8">
      <h1>Test Supabase</h1>
      <button onClick={testConnection}>Test Connection</button>
    </div>
  );
}