// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      console.error('Error signing up:', authError);
      setError('Gagal mendaftar: ' + authError.message);
    } else {
      setMessage('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen">
      {/* Layer untuk gambar background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpeg')" }} // Ganti dengan nama file background Anda
      ></div>
      {/* Layer overlay gelap */}
      <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>

      {/* Konten utama dengan z-index */}
      <div className="relative z-10 w-full max-w-5xl m-4 bg-[#1C243A] bg-opacity-80 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Kolom Kiri: Gambar dan Tagline */}
        <div className="relative block min-h-[600px] bg-red-500">
          {/* --- PERBAIKAN DI SINI --- */}
          <Image
            src='/neuron.jpeg' // Ganti dengan nama file neuron Anda
            alt="Neuron Background"
            fill
            
            className="object-cover"
          />
          {/* ------------------------- */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
          <div className="absolute bottom-8 left-8">
            <h1 className="text-3xl font-bold text-white mb-3">NEUROVR</h1>
            <p className="text-white text-lg bg-glassmorph bg-opacity-30 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              Petualangan Belajar Otak dengan Realitas Virtual.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Form Registrasi */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-2">Daftar Akun</h2>
          <p className="text-gray-400 mb-8">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Input Nama Lengkap */}
            <div className="relative">
              <HiOutlineUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* ... sisa form (email, password, dll) tetap sama ... */}
             <div className="relative">
              <HiOutlineMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <HiOutlineLockClosed className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Konfirmasi Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Daftar
            </button>
          </form>

          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        </div>
      </div>
    </main>
  );
}