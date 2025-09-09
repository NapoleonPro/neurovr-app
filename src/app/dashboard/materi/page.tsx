// src/app/dashboard/materi/page.tsx
import Image from 'next/image';
import Link from 'next/link';

// --- DATA MATERI ---
// Nanti, data ini bisa Anda ambil dari database Supabase.
// Untuk sekarang, kita definisikan langsung di sini.
const learningMaterials = [
  {
    id: 1,
    title: 'Sistem Saraf',
    type: 'PPT',
    thumbnailUrl: '/thumbnails/ppt-sistem-saraf.png', // Sesuaikan dengan nama file Anda
    fileUrl: '/path/to/your/presentation.pptx', // Path untuk di-download
    duration: null,
  },
  {
    id: 2,
    title: 'Sistem Saraf',
    type: 'Video',
    thumbnailUrl: '/thumbnails/video-sistem-saraf.png', // Sesuaikan dengan nama file Anda
    fileUrl: '/path/to/your/video.mp4', // Path ke halaman video player atau file
    duration: '3:07',
  },
  // Tambahkan materi lain di sini jika perlu
  // {
  //   id: 3,
  //   title: 'Materi Lainnya',
  //   type: 'PPT',
  //   thumbnailUrl: '/thumbnails/materi-lain.png',
  //   fileUrl: '/path/to/your/other.pptx',
  //   duration: null,
  // },
];

export default function MateriPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Judul Halaman */}
      <h1 className="text-4xl font-bold text-white mb-10">Modul</h1>

      {/* Grid untuk Kartu Materi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {learningMaterials.map((material) => (
          // Setiap materi akan di-render sebagai Link yang bisa diklik
          <Link href={material.fileUrl} key={material.id}>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden 
                           group transition-all duration-300 ease-in-out
                           hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
                           border border-transparent hover:border-blue-500/30">
              
              {/* Bagian Thumbnail */}
              <div className="relative w-full h-48">
                <Image
                  src={material.thumbnailUrl}
                  alt={`Thumbnail untuk ${material.title}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Tag Tipe (PPT/Video) */}
                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white rounded-md
                                 ${material.type === 'PPT' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  {material.type}
                </span>

                {/* Durasi (hanya untuk video) */}
                {material.type === 'Video' && material.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs text-white bg-black/70 rounded">
                    {material.duration}
                  </span>
                )}
              </div>

              {/* Bagian Judul */}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-white truncate">
                  {material.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}