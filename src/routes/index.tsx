import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  BookmarkCheck,
  BookOpen,
  Camera,
  ChevronRight,
  ClipboardList,
  Globe2,
  GraduationCap,
  Leaf,
  LineChart,
  MessageSquareWarning,
  Microscope,
  Quote,
  ScanLine,
  Sparkles,
  Sprout,
  Stethoscope,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScannerCard } from "@/components/site/scanner-card";
import heroImg from "@/assets/hero-plant.jpg";
import sdgImg from "@/assets/sdg-illustration.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoScan AI — Deteksi Penyakit Tanaman dengan AI dalam Hitungan Detik" },
      {
        name: "description",
        content:
          "Unggah foto tanaman, dapatkan diagnosis penyakit, rekomendasi perawatan, dan langkah pencegahan otomatis dari AI. Mendukung SDG 15.",
      },
      { property: "og:title", content: "EcoScan AI — AgriTech Berbasis AI" },
      {
        property: "og:description",
        content:
          "Platform deteksi penyakit tanaman berbasis AI untuk petani dan pecinta tanaman.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { label: "Scan Tanaman", value: "10.000+", icon: ScanLine },
  { label: "Jenis Penyakit", value: "500+", icon: Microscope },
  { label: "Akurasi AI", value: "95%", icon: Target },
  { label: "Mendukung", value: "SDG 15", icon: Globe2 },
];

const problems = [
  {
    icon: MessageSquareWarning,
    title: "Sulit Mengenali Dini",
    desc: "Petani sering terlambat mengenali penyakit tanaman karena gejala awal yang sulit dibedakan.",
  },
  {
    icon: Users,
    title: "Akses Pakar Terbatas",
    desc: "Tidak semua wilayah memiliki akses mudah ke ahli pertanian untuk konsultasi langsung.",
  },
  {
    icon: TrendingDown,
    title: "Hasil Panen Menurun",
    desc: "Kerusakan tanaman yang tidak segera ditangani menyebabkan hasil panen menurun drastis.",
  },
  {
    icon: GraduationCap,
    title: "Minim Edukasi",
    desc: "Kurangnya materi edukasi kesehatan tanaman yang mudah dipahami masyarakat umum.",
  },
];

const steps = [
  { icon: Camera, title: "Upload Foto", desc: "Unggah foto daun atau tanaman dari galeri atau kamera." },
  { icon: Sparkles, title: "AI Menganalisis", desc: "Model AI vision memproses gambar dalam hitungan detik." },
  { icon: Stethoscope, title: "Diagnosis Penyakit", desc: "Dapatkan nama penyakit dan tingkat keyakinan." },
  { icon: Sprout, title: "Rekomendasi", desc: "Panduan perawatan & langkah pencegahan langsung." },
  { icon: ClipboardList, title: "Simpan Riwayat", desc: "Pantau perkembangan tanaman dari waktu ke waktu." },
];

const features = [
  { icon: Camera, title: "Upload Drag & Drop", desc: "Antarmuka upload modern dengan dukungan multi-format." },
  { icon: Sparkles, title: "AI Plant Analysis", desc: "Analisis gambar real-time dengan model vision terbaru." },
  { icon: Stethoscope, title: "Diagnosis Penyakit", desc: "Identifikasi 500+ penyakit tanaman secara akurat." },
  { icon: Sprout, title: "Rekomendasi Perawatan", desc: "Panduan penanganan spesifik untuk tiap kondisi." },
  { icon: ClipboardList, title: "Riwayat Analisis", desc: "Semua hasil tersimpan rapi di dashboard pribadi." },
  { icon: BookOpen, title: "Artikel Edukasi", desc: "Pustaka tips perawatan & pertanian berkelanjutan." },
];

const testimonials = [
  {
    name: "Pak Budi",
    role: "Petani Tomat, Magelang",
    quote: "Dulu saya butuh waktu lama untuk tahu penyakit tanaman. Sekarang cukup foto dan langsung tahu solusinya.",
  },
  {
    name: "Sari Wulandari",
    role: "Pecinta Tanaman Hias",
    quote: "Monstera saya selamat berkat diagnosis cepat dari EcoScan AI. Sangat membantu untuk pemula seperti saya.",
  },
  {
    name: "Rizky Pratama",
    role: "Mahasiswa Pertanian UGM",
    quote: "Alat bantu belajar paling efektif. Akurasinya tinggi dan penjelasannya mudah dipahami.",
  },
];

const faqs = [
  {
    q: "Bagaimana cara kerja EcoScan AI?",
    a: "Anda mengunggah foto tanaman, model AI vision kami menganalisis gambar, lalu memberikan diagnosis penyakit beserta rekomendasi perawatan dan pencegahan.",
  },
  {
    q: "Seberapa akurat hasil diagnosis?",
    a: "Akurasi model kami mencapai 95% untuk penyakit-penyakit umum. Tingkat keyakinan ditampilkan transparan pada setiap hasil.",
  },
  {
    q: "Apakah EcoScan AI gratis?",
    a: "Anda dapat mencoba scanner secara gratis tanpa login. Fitur lengkap seperti riwayat dan bookmark tersedia setelah membuat akun gratis.",
  },
  {
    q: "Tanaman apa saja yang didukung?",
    a: "Saat ini kami mendukung 500+ jenis tanaman pangan, hortikultura, hingga tanaman hias populer.",
  },
];

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
    viewport: { once: true, margin: "-80px" },
  };
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="hero-bg relative overflow-hidden pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Vision untuk pertanian berkelanjutan
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Deteksi Penyakit Tanaman dalam{" "}
              <span className="gradient-text">Hitungan Detik</span> dengan AI
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Unggah foto tanaman Anda dan dapatkan analisis kesehatan, diagnosis penyakit, serta
              rekomendasi perawatan otomatis — kapan pun, di mana pun.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-glow">
                <Link to="/scan">
                  <ScanLine className="mr-2 h-5 w-5" /> Mulai Scan Sekarang
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="#cara-kerja">
                  Pelajari Lebih Lanjut <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> 95% Akurasi
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" /> Mendukung SDG 15
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Dipakai 10.000+ pengguna
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 to-accent/10 shadow-glow">
              <img
                src={heroImg}
                alt="Daun tanaman dianalisis oleh AI"
                className="h-full w-full object-cover"
                width={1024}
                height={1024}
              />
              <div className="pointer-events-none absolute inset-x-8 top-0 bottom-0 overflow-hidden">
                <div className="animate-scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow" />
              </div>
            </div>

            <motion.div
              className="absolute -left-4 top-12 hidden rounded-2xl border border-border bg-card/90 p-3 shadow-card backdrop-blur sm:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-success/15 text-success">
                  <Leaf className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Tanaman</p>
                  <p className="text-sm font-semibold">Tomat — Sehat</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-4 bottom-10 hidden rounded-2xl border border-border bg-card/90 p-3 shadow-card backdrop-blur sm:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs text-muted-foreground">Keyakinan AI</p>
              <p className="font-display text-xl font-bold text-primary">96%</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative border-y border-border bg-card/40 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASALAH */}
      <Section id="masalah">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mengapa</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Mengapa EcoScan AI Dibutuhkan?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tantangan nyata yang dihadapi petani dan pecinta tanaman setiap hari.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <motion.div key={p.title} {...fadeUp(i * 0.1)}>
              <Card className="group h-full rounded-3xl border-border p-6 transition-all hover:-translate-y-1 hover:shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-transform group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CARA KERJA */}
      <Section id="cara-kerja" className="border-y border-border bg-card/30">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Cara Kerja</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Dari Foto ke Diagnosis dalam 5 Langkah
          </h2>
        </motion.div>
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div key={s.title} {...fadeUp(i * 0.08)} className="relative text-center">
                <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-card ring-1 ring-border">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  Langkah {i + 1}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FITUR */}
      <Section id="fitur">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Fitur</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i * 0.06)}>
              <Card className="group h-full rounded-3xl border-border p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* DEMO SCANNER */}
      <Section id="demo" className="border-y border-border bg-card/30">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Coba Sekarang</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Demo AI Scanner Langsung
          </h2>
          <p className="mt-3 text-muted-foreground">
            Unggah foto tanaman dan lihat AI bekerja dalam hitungan detik — tanpa perlu mendaftar.
          </p>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="mt-12">
          <ScannerCard />
        </motion.div>
      </Section>

      {/* SDG */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp(0)} className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-2">
              <img
                src={sdgImg}
                alt="Ilustrasi pertanian berkelanjutan"
                className="aspect-[4/3] w-full rounded-3xl object-cover"
                loading="lazy"
                width={1280}
                height={1024}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-2xl bg-gradient-to-br from-primary to-accent px-4 py-3 text-primary-foreground shadow-glow sm:block">
              <p className="text-xs uppercase tracking-widest opacity-90">SDG</p>
              <p className="font-display text-2xl font-bold">15 — Life on Land</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Dampak SDGs</span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Mendukung Sustainable Development Goals
            </h2>
            <p className="mt-3 text-muted-foreground">
              EcoScan AI berkontribusi langsung pada SDG 15 — menjaga ekosistem darat dan
              keberlanjutan pertanian.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Menjaga kesehatan tanaman secara berkelanjutan",
                "Mendukung praktik pertanian berkelanjutan",
                "Mengurangi kerusakan lingkungan akibat pestisida berlebih",
                "Meningkatkan produktivitas tanaman dengan data presisi",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary">
                    <Sprout className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* TESTIMONI */}
      <Section className="border-y border-border bg-card/30">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Testimoni</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Dipercaya Petani & Pecinta Tanaman
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(i * 0.1)}>
              <Card className="h-full rounded-3xl border-border p-6">
                <Quote className="h-6 w-6 text-primary/50" />
                <p className="mt-3 text-sm text-foreground/85">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <span key={k}>★</span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
        </motion.div>
        <motion.div {...fadeUp(0.05)} className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Section>

      {/* CTA */}
      <Section>
        <motion.div {...fadeUp(0)}>
          <Card className="relative overflow-hidden rounded-[2rem] border-border bg-gradient-to-br from-primary to-accent p-10 text-primary-foreground shadow-glow">
            <div className="relative z-10 grid items-center gap-6 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                  Siap merawat tanaman lebih cerdas?
                </h2>
                <p className="mt-3 max-w-md opacity-90">
                  Gabung gratis dan dapatkan akses ke dashboard, riwayat analisis, dan pustaka
                  edukasi.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link to="/auth">Daftar Gratis</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"
                >
                  <Link to="/scan">Coba Scanner</Link>
                </Button>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </Card>
        </motion.div>
      </Section>

      <Footer />
    </div>
  );
}
