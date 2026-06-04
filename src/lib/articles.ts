import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import article4 from "@/assets/article-4.jpg";
import article5 from "@/assets/article-5.jpg";
import article6 from "@/assets/article-6.jpg";

export type ArticleCategory =
  | "Penyakit Tanaman"
  | "Tips Perawatan"
  | "Pertanian Modern"
  | "Tanaman Hias"
  | "Lingkungan";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  image: string;
  readTime: string;
  date: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "mengenal-hawar-daun-pada-tomat",
    title: "Mengenal Hawar Daun pada Tomat dan Cara Mengatasinya",
    excerpt:
      "Hawar daun atau early blight adalah penyakit umum pada tanaman tomat yang dapat menurunkan hasil panen hingga 50%. Pelajari gejala dan penanganannya.",
    category: "Penyakit Tanaman",
    image: article1,
    readTime: "6 menit",
    date: "12 Mei 2026",
    content: `Hawar daun (early blight) disebabkan oleh jamur Alternaria solani yang menyerang daun, batang, dan buah tomat.

Gejala utama: bercak coklat berbentuk cincin konsentris pada daun bawah, daun menguning, dan rontok prematur.

Penanganan:
- Buang daun yang terinfeksi dan musnahkan
- Semprot fungisida berbahan aktif klorotalonil atau mankozeb
- Lakukan rotasi tanaman setiap 2-3 tahun
- Pastikan sirkulasi udara antar tanaman cukup

Pencegahan: pilih varietas tahan penyakit, hindari penyiraman dari atas, dan gunakan mulsa untuk mengurangi percikan air dari tanah.`,
  },
  {
    slug: "5-tips-perawatan-tanaman-pemula",
    title: "5 Tips Perawatan Tanaman untuk Pemula",
    excerpt:
      "Baru mulai berkebun? Ikuti 5 panduan sederhana ini untuk memastikan tanaman Anda tumbuh sehat dan produktif.",
    category: "Tips Perawatan",
    image: article2,
    readTime: "4 menit",
    date: "08 Mei 2026",
    content: `1. Kenali kebutuhan cahaya setiap tanaman.
2. Siram sesuai kebutuhan, bukan jadwal kaku.
3. Gunakan media tanam yang sesuai.
4. Berikan pupuk organik secara berkala.
5. Pantau hama dan penyakit sejak dini.`,
  },
  {
    slug: "pertanian-presisi-era-ai",
    title: "Pertanian Presisi di Era AI: Masa Depan Pangan",
    excerpt:
      "Bagaimana kecerdasan buatan mengubah pertanian tradisional menjadi sistem presisi yang efisien dan berkelanjutan.",
    category: "Pertanian Modern",
    image: article3,
    readTime: "7 menit",
    date: "01 Mei 2026",
    content: `Pertanian presisi memanfaatkan sensor, drone, dan AI untuk memantau kesehatan tanaman secara real-time. Hasilnya: penggunaan air dan pupuk lebih efisien, hasil panen meningkat, dan dampak lingkungan berkurang.`,
  },
  {
    slug: "merawat-monstera-deliciosa",
    title: "Panduan Lengkap Merawat Monstera Deliciosa",
    excerpt:
      "Monstera deliciosa adalah salah satu tanaman hias paling populer. Pelajari cara merawatnya agar daunnya selalu indah.",
    category: "Tanaman Hias",
    image: article4,
    readTime: "5 menit",
    date: "24 April 2026",
    content: `Monstera menyukai cahaya tidak langsung yang terang. Siram saat 2-3 cm bagian atas media tanam sudah kering. Beri pupuk cair seimbang sebulan sekali pada musim tumbuh.`,
  },
  {
    slug: "dampak-perubahan-iklim-pertanian",
    title: "Dampak Perubahan Iklim terhadap Pertanian Tropis",
    excerpt:
      "Suhu naik, pola hujan berubah, dan hama bermutasi. Bagaimana petani harus beradaptasi dengan tantangan baru ini?",
    category: "Lingkungan",
    image: article5,
    readTime: "8 menit",
    date: "18 April 2026",
    content: `Perubahan iklim menyebabkan pergeseran musim tanam, peningkatan serangan hama, dan stres tanaman. Adaptasi mencakup pemilihan varietas tahan iklim, sistem irigasi cerdas, dan diversifikasi tanaman.`,
  },
  {
    slug: "pertanian-organik-berkelanjutan",
    title: "Mengapa Pertanian Organik Adalah Masa Depan",
    excerpt:
      "Pertanian organik bukan sekadar tren — ia adalah jawaban untuk produktivitas jangka panjang dan kesehatan tanah.",
    category: "Lingkungan",
    image: article6,
    readTime: "6 menit",
    date: "10 April 2026",
    content: `Pertanian organik mengurangi degradasi tanah, meningkatkan keanekaragaman hayati, dan menghasilkan pangan yang lebih sehat. Mulai dari kompos sendiri, hindari pestisida sintetis, dan terapkan rotasi tanaman.`,
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
