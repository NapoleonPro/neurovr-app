// src/app/dashboard/game/mind-match/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";

export async function saveGameResult(score: number, achievement: string | null) {
  try {
    const supabase = await createClient();

    // Pertama, dapatkan data pengguna yang sedang login
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Pengguna tidak terautentikasi.' };
    }

    // Data yang akan disimpan
    const progressData = {
      user_id: user.id,
      activity_name: 'mind_match_game', // Nama unik untuk game ini
      score: score,
      details: {
        achievement: achievement,
        completed_at: new Date().toISOString(),
        game_type: 'mind_match',
        max_score: 100
      },
      updated_at: new Date().toISOString()
    };

    // Gunakan 'upsert' untuk menyimpan data.
    // 'upsert' akan membuat baris baru jika belum ada, 
    // atau meng-update baris yang ada jika pengguna mengulang game.
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progressData, { 
        onConflict: 'user_id,activity_name',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Supabase error saving progress:', error);
      return { success: false, error: `Database error: ${error.message}` };
    }

    console.log('Game result saved successfully:', data);
    return { success: true, message: 'Progres berhasil disimpan!', data };

  } catch (error) {
    console.error('Unexpected error saving game result:', error);
    return { success: false, error: 'Terjadi kesalahan tak terduga saat menyimpan data.' };
  }
}

// Fungsi untuk mengambil riwayat game pemain (opsional)
export async function getGameHistory() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Pengguna tidak terautentikasi.' };
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_name', 'mind_match_game')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching game history:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Unexpected error fetching game history:', error);
    return { success: false, error: 'Terjadi kesalahan tak terduga saat mengambil riwayat.' };
  }
}