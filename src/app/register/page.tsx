// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Sesuaikan path jika perlu
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Menyimpan data tambahan (seperti nama lengkap) ke metadata pengguna
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      setMessage('Gagal mendaftar: ' + error.message);
    } else {
      // Jika toggle "Confirm email" dimatikan, `data.user` akan berisi data user
      // Jika aktif, `data.user` akan null sampai email dikonfirmasi
      console.log('Registration successful:', data);
      setMessage('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
      
      // Arahkan ke halaman login setelah beberapa saat
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Daftar Akun NeuroVR</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">Nama Lengkap</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Daftar
            </button>
          </div>
        </form>
        {message && <p className="text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}