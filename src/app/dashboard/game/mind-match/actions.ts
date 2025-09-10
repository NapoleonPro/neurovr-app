// src/app/dashboard/game/mind-match/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function saveGameResult(score: number, achievement: string | null) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // Pertama, dapatkan data pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Pengguna tidak terautentikasi.' };
  }

  const progressData = {
    user_id: user.id,
    activity_name: 'mind_match_game', // Nama unik untuk game ini
    score: score,
    details: achievement ? { achievement: achievement } : null,
  };

  // Gunakan 'upsert' untuk menyimpan data.
  // 'upsert' akan membuat baris baru jika belum ada, 
  // atau meng-update baris yang ada jika pengguna mengulang game.
  const { error } = await supabase
    .from('user_progress')
    .upsert(progressData, { onConflict: 'user_id, activity_name' });

  if (error) {
    console.error('Supabase error saving progress:', error);
    return { error: 'Gagal menyimpan progres.' };
  }

  return { success: true, message: 'Progres berhasil disimpan!' };
}
