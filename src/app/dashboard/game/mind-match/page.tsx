// src/app/dashboard/game/mind-match/page.tsx
import MindMatchClient from "./MindMatchClient";

// --- DATA PERMAINAN (KONSTAN) ---
// Game data untuk sistem saraf dengan 12 pasangan istilah-definisi
const GAME_DATA = [
  { id: 1, term: 'Neuron', definition: 'Sel yang menyusun sistem saraf dan menghantarkan impuls' },
  { id: 2, term: 'Mielin', definition: 'Selubung lemak yang melindungi akson dan mempercepat transmisi' },
  { id: 3, term: 'Sistem Saraf Pusat', definition: 'Otak dan sumsum tulang belakang sebagai pusat kontrol' },
  { id: 4, term: 'Meninges', definition: 'Tiga lapisan pelindung: durameter, arachnoid, dan piameter' },
  { id: 5, term: 'Neurotransmitter', definition: 'Zat kimia pembawa sinyal antar neuron di sinapsis' },
  { id: 6, term: 'Dendrit', definition: 'Cabang neuron yang menerima sinyal dari neuron lain' },
  { id: 7, term: 'Sistem Saraf Tepi', definition: 'Saraf yang menghubungkan SSP dengan organ tubuh' },
  { id: 8, term: 'Sel Schwann', definition: 'Sel yang memproduksi selubung mielin di sistem saraf tepi' },
  { id: 9, term: 'Sinapsis', definition: 'Sambungan antar neuron tempat transmisi sinyal terjadi' },
  { id: 10, term: 'Akson', definition: 'Serabut panjang neuron yang menghantarkan impuls keluar' },
  { id: 11, term: 'Refleks', definition: 'Respons otomatis tubuh terhadap rangsangan tertentu' },
  { id: 12, term: 'Ganglia', definition: 'Kumpulan badan sel saraf di luar sistem saraf pusat' }
];

export default async function MindMatchPage() {
  return <MindMatchClient gameData={GAME_DATA} />;
}