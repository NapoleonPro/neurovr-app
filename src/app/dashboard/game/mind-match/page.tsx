// src/app/dashboard/game/mind-match/page.tsx
import MindMatchClient from "./MindMatchClient"; // Impor komponen klien

// --- DATA PERMAINAN (KONSTAN) ---
// Karena soal tidak akan berubah, kita definisikan di sini.
// Ini membuat game lebih cepat karena tidak perlu query ke DB untuk soal.
const GAME_DATA = [
  { id: 1, term: 'Neuron', definition: 'Sel yang menyusun sistem saraf' },
  { id: 2, term: 'Mielin', definition: 'Memproduksi selubung myelin' },
  { id: 3, term: 'Sistem saraf pusat', definition: 'Otak dan sumsum tulang belakang' },
  { id: 4, term: 'Meninges', definition: 'Durameter, arachnoid dan piameter' },
  { id: 5, term: 'Neurotransmitter', definition: 'Menghantarkan sinyal dari terminal akson' },
  { id: 6, term: 'Impuls', definition: 'Rangsangan yang telah ditangkap oleh alat indera' },
  { id: 7, term: 'Sistem Saraf Tepi', definition: 'Menghubungkan neuron sensoris dan motoris' },
  { id: 8, term: 'Sel Schwan', definition: 'Neuron yang berfungsi menerima dan memproses rangsangan dari dendrit' },
  // Tambahkan 12 soal lainnya di sini hingga total 20...
];


export default async function MindMatchPage() {
  // Komponen ini (Server Component) hanya meneruskan data soal
  // ke komponen interaktif di sisi klien.
  return <MindMatchClient gameData={GAME_DATA} />;
}
