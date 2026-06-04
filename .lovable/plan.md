## EcoScan AI — Build Plan

Platform AgriTech berbasis AI untuk deteksi penyakit tanaman. Build dilakukan end-to-end: landing page lengkap + autentikasi + dashboard pengguna + scanner AI nyata + riwayat tersimpan.

### Stack & Setup
- TanStack Start + React + Tailwind v4 + shadcn/ui + Framer Motion + Lucide.
- Lovable Cloud (Supabase) untuk auth + database + storage.
- Lovable AI Gateway (`google/gemini-3-flash-preview`, vision) untuk analisis gambar tanaman.
- Font: Poppins (heading) + Inter (body) via Google Fonts di `__root.tsx`.
- Tema warna sesuai brief (`#22C55E` primary, dst.) didefinisikan di `src/styles.css` (`oklch`) dengan dark mode toggle.

### Halaman & Routing
Public:
- `/` Landing page lengkap (12 section).
- `/auth` Login/Signup (Email+Password & Google).
- `/articles` & `/articles/$slug` Edukasi (konten statis seed).

Protected (`_authenticated/`):
- `/dashboard` Statistik + chart.
- `/scan` Upload + scanner AI (juga dapat dipakai tanpa simpan untuk demo publik di landing).
- `/history` Tabel riwayat + filter.
- `/bookmarks` Artikel ter-bookmark.
- `/profile` Profil pengguna.

### Landing Page Sections
1. Navbar glass + dark-mode toggle + CTA.
2. Hero (kiri copy + CTA, kanan ilustrasi tanaman + scanning glow + floating diagnosis cards, Framer Motion).
3. Statistik bar (10.000+ scan, 500+ penyakit, 95% akurasi, SDG 15).
4. Section Masalah (4 card icon).
5. Cara Kerja (timeline horizontal 5 step beranimasi).
6. Fitur Utama (grid 3 kolom × 6 card, hover lift).
7. Demo AI Scanner interaktif (upload, preview, progress bar, hasil card premium) — memanggil server function nyata.
8. Section SDG 15 (ilustrasi + 4 poin).
9. Testimoni (carousel shadcn).
10. FAQ (accordion).
11. CTA akhir.
12. Footer (logo, menu, sosmed, copyright).

### Backend (Lovable Cloud)
Tabel:
- `profiles` (id → auth.users, full_name, avatar_url, created_at) + trigger auto-insert on signup.
- `scans` (id, user_id, image_url, plant_name, status enum sehat/ringan/sedang/berat, confidence, damage_level, diagnosis, treatment, prevention, raw_json, created_at).
- `bookmarks` (id, user_id, article_slug, created_at).

RLS: setiap user hanya akses row miliknya. GRANT untuk authenticated + service_role.

Storage bucket `scan-images` (public read) untuk preview gambar.

### Server Functions (`createServerFn`)
- `analyzeScan({ imageBase64 })` — auth optional; panggil Lovable AI vision dengan prompt JSON-structured (plant_name, status, confidence, damage_level, diagnosis, treatment[], prevention[]); jika user login → upload ke storage + insert ke `scans`.
- `listScans`, `getScan`, `deleteScan` — auth required.
- `toggleBookmark`, `listBookmarks` — auth required.

### Dashboard
- Card statistik: total scan, penyakit terdeteksi, tanaman sehat, bookmark tersimpan.
- Chart Recharts (line/area trend mingguan) + donut status distribusi.
- Sidebar shadcn collapsible dengan link aktif.

### History
- Tabel shadcn (foto thumbnail, nama, diagnosis, badge tingkat kerusakan, tanggal, aksi view/delete).
- Filter mingguan/bulanan/tahunan + search.

### Articles
- 6–8 artikel seed (Markdown/JSON) dengan kategori, thumbnail (generated images), bookmark button.

### Desain Detail
- Glassmorphism ringan pada nav & card hero.
- Smooth scroll + scroll reveal (Framer Motion `whileInView`).
- Skeleton loading di list/dashboard.
- Mobile-first responsive di semua breakpoint.
- Dark mode toggle persist di localStorage.
- SEO: `head()` per route (title, description, og:*), alt text, JSON-LD organization di root.

### Asset Generation
Generate via `imagegen`:
- Hero ilustrasi tanaman + AI scan (transparent atau bg gradient).
- Ilustrasi cara kerja (opsional ringan, sebagian icon Lucide).
- SDG 15 hero visual.
- Thumbnail artikel (6–8).
- Foto testimoni avatar (3–4).

### Urutan Eksekusi
1. Enable Lovable Cloud + buat skema + storage + auth providers (email+google).
2. Tema + font + design tokens di `styles.css`.
3. Generate semua aset gambar paralel.
4. Komponen reusable (Navbar, Footer, GlassCard, StatBadge, dst.).
5. Landing page sections (1–12).
6. Auth page + integrasi sign-in Google.
7. Layout `_authenticated/` + Sidebar.
8. Server functions (analyze, scans, bookmarks).
9. Scanner page + integrasi demo di landing.
10. Dashboard, History, Bookmarks, Profile, Articles.
11. QA: SEO meta, dark mode, mobile, error/not-found boundaries.

### Catatan Teknis
- `analyzeScan` mengembalikan output terstruktur (Zod schema) agar UI konsisten.
- Image upload max 5MB, jenis JPG/PNG/WEBP; resize client-side sebelum kirim ke AI.
- Bearer attacher untuk server fn auth sudah disiapkan via integrasi Supabase.
- Semua route protected memakai layout `_authenticated/route.tsx` bawaan integrasi (ssr: false).

Setelah plan disetujui, saya mulai dari enable Cloud lalu lanjut sesuai urutan di atas.