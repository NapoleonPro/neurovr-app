// src/app/page.tsx

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Langsung arahkan pengguna ke halaman login
  redirect('/login');

  // Karena redirect terjadi, komponen ini tidak perlu me-render apapun.
  // Mengembalikan null adalah praktik yang umum di sini.
  return null;
}