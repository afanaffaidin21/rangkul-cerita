import {
  EmotionOption,
  HelplineItem,
  SelfHelpResource,
  ArticleItem,
  TestimonialItem,
  FAQItem,
  PartnershipProgram,
} from "../types";

export const EMOTION_OPTIONS: EmotionOption[] = [
  {
    id: "Cemas",
    label: "Cemas & Gelisah",
    iconName: "Wind",
    colorHex: "#C8A4D8",
    bgHex: "#F7F0FA",
    description: "Pikiran berputar, jantung berdebar, atau khawatir berlebihan.",
  },
  {
    id: "Sedih",
    label: "Sedih & Hampa",
    iconName: "CloudRain",
    colorHex: "#8FAFD0",
    bgHex: "#EFF5FA",
    description: "Merasa terluka, ingin menangis, atau kehilangan semangat.",
  },
  {
    id: "Kesepian",
    label: "Kesepian",
    iconName: "UserX",
    colorHex: "#A4A8CC",
    bgHex: "#F0F1F7",
    description: "Merasa sendirian, tidak dipahami, atau terasing dari sekitar.",
  },
  {
    id: "Lelah",
    label: "Lelah Mental",
    iconName: "BatteryLow",
    colorHex: "#C8B59A",
    bgHex: "#F8F5F0",
    description: "Kehabisan energi, burnout akademik, atau butuh jeda.",
  },
  {
    id: "Marah",
    label: "Marah & Kesal",
    iconName: "Flame",
    colorHex: "#E89887",
    bgHex: "#FAF0EE",
    description: "Merasa tidak adil, frustrasi, atau emosi meluap-luap.",
  },
  {
    id: "Bingung",
    label: "Bingung",
    iconName: "HelpCircle",
    colorHex: "#E0AFC3",
    bgHex: "#FAF0F4",
    description: "Tidak tahu harus berbuat apa atau kesulitan mengambil keputusan.",
  },
  {
    id: "Mati rasa",
    label: "Mati Rasa",
    iconName: "MinusCircle",
    colorHex: "#A0AAA4",
    bgHex: "#F3F5F2",
    description: "Kesulitan merasakan apa pun, terasa hampa dan datar.",
  },
  {
    id: "Lumayan baik",
    label: "Lumayan Baik",
    iconName: "Sun",
    colorHex: "#86BFA8",
    bgHex: "#EEF7F2",
    description: "Kondisi stabil, ingin merefleksikan hal positif atau menjaga mood.",
  },
];


export const SELF_HELP_RESOURCES: SelfHelpResource[] = [
  {
    id: "grounding-54321",
    title: "Grounding 5-4-3-2-1",
    category: "Cemas dan Overthinking",
    duration: "2 Menit",
    format: "Latihan Praktis",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Latihan indera singkat untuk meredakan serangan cemas, gelisah, dan pikiran yang memutar tak terkendali.",
    isInteractiveExercise: true,
    steps: [
      "Sebutkan 5 benda yang bisa kamu LIHAT di sekitarmu.",
      "Sebutkan 4 benda yang bisa kamu SENTUH atau rasakan teksturnya.",
      "Sebutkan 3 suara yang bisa kamu DENGAR saat ini.",
      "Sebutkan 2 aroma yang bisa kamu CIUM.",
      "Sebutkan 1 rasa yang bisa kamu RASAKAN di lidahmu.",
    ],
  },
  {
    id: "box-breathing",
    title: "Pernapasan Kotak 4-4-4-4",
    category: "Cemas dan Overthinking",
    duration: "3 Menit",
    format: "Audio Breathing",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Teknik ritme pernapasan untuk menurunkan denyut jantung dan menenangkan sistem saraf.",
    isInteractiveExercise: true,
    steps: [
      "Tarik napas perlahan melalui hidung selama 4 detik.",
      "Tahan napasmu selama 4 detik.",
      "Hembuskan napas perlahan melalui mulut selama 4 detik.",
      "Tahan paru-parumu kosong selama 4 detik.",
    ],
  },
  {
    id: "parent-message-template",
    title: "Template Meminta Bantuan ke Orang Tua",
    category: "Keluarga",
    duration: "1 Menit",
    format: "Template Pesan",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Susunan kata-kata sopan dan tenang untuk menyampaikan bahwa kamu sedang tidak baik-baik saja dan butuh teman bicara.",
    contentMarkdown: `Halo [Ibu/Bapak], akhir-akhir ini aku merasa cukup lelah dan cemas dengan [tugas/sekolah/kondisiku]. Aku belum tahu semua jawabannya, tapi aku butuh waktu untuk ngobrol sebentar kalau [Ibu/Bapak] ada waktu senggang hari ini. Terima kasih ya.`,
  },
  {
    id: "loneliness-reflection",
    title: "Menamai Rasa Kesepian Tanpa Membenci Diri",
    category: "Kesepian",
    duration: "4 Menit",
    format: "Artikel Panduan",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Memahami bedanya 'sendiri' dan 'kesepian', serta tindakan kecil untuk merasa terhubung kembali.",
  },
  {
    id: "academic-burnout-reset",
    title: "Batas Aman saat Menghadapi Tekanan Ujian & Skripsi",
    category: "Stres Sekolah atau Kuliah",
    duration: "3 Menit",
    format: "Latihan Praktis",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Memisahkan harga diri dari nilai akademik dan menyusun micro-breaks yang efektif.",
  },
  {
    id: "friendship-boundary",
    title: "Cara Menentukan Batas dalam Pertemanan Toxic",
    category: "Pertemanan",
    duration: "5 Menit",
    format: "Artikel Panduan",
    reviewer: "Materi informatif untuk refleksi awal",
    summary: "Langkah menjaga kesehatan emosional tanpa harus memicu pertengkaran besar.",
  },
];

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: "art-1",
    title: "Kenapa Aku Merasa Capek Padahal Tidak Banyak Aktivitas Fisik?",
    slug: "kenapa-merasa-capek-padahal-tidak-banyak-aktivitas",
    category: "Kelelahan Emosional",
    readTime: "3 Menit Baca",
    reviewer: "Materi informatif untuk refleksi awal",
    updatedAt: "18 Mei 2026",
    excerpt: "Kelelahan mental karena memendam emosi atau overthinking sering kali menyerap energi lebih besar daripada olahraga berat.",
    fullBody: [
      "Pernahkah kamu terbangun di pagi hari merasa tubuhmu berat, padahal seharian kemarin kamu hanya berada di kamar? Kamu tidak sendirian.",
      "Kelelahan emosional (emotional fatigue) terjadi ketika otak kita terus-menerus memproses kecemasan, rasa takut mengecewakan orang lain, atau konflik internal tanpa sempat memprosesnya.",
      "Langkah pertama yang bisa kamu lakukan adalah tidak menyalahkan diri sendiri. Mengaku 'aku sedang lelah emosi' adalah bentuk kejujuran yang menenangkan.",
      "Cobalah beri jeda 10 menit tanpa layar gawai, minum air hangat, dan lakukan pengecekan emosi sederhana."
    ],
  },
  {
    id: "art-2",
    title: "Cara Memulai Cerita tentang Perasaanmu kepada Orang Tua",
    slug: "cara-memulai-cerita-kepada-orang-tua",
    category: "Komunikasi Keluarga",
    readTime: "4 Menit Baca",
    reviewer: "Materi informatif untuk refleksi awal",
    updatedAt: "10 Mei 2026",
    excerpt: "Meminta bantuan ke orang tua bisa terasa menakutkan. Berikut panduan praktis memilih waktu dan kata-kata pembuka yang aman.",
    fullBody: [
      "Bagi remaja dan mahasiswa di Indonesia, membicarakan kesehatan emosional kepada orang tua sering kali diwarnai kekhawatiran dianggap kurang bersyukur atau kurang beribadah.",
      "Kuncinya adalah mulai dengan pernyataan perasaan pribadi (I-statement), bukan tuduhan.",
      "Contoh: 'Bu, akhir-akhir ini aku merasa sering cemas dan sulit tidur karena tugas. Aku ingin bercerita sebentar kalau Ibu tidak sibuk.'",
      "Gunakan template pesan yang tersedia di Rangkul Cerita jika kamu merasa gagap menyampaikannya secara langsung."
    ],
  },
  {
    id: "art-3",
    title: "Bedanya Sedih Biasa, Stres Akademik, dan Kapan Harus Cari Bantuan Profesional",
    slug: "bedanya-sedih-stres-dan-bantuan-profesional",
    category: "Literasi Emosi",
    readTime: "5 Menit Baca",
    reviewer: "Materi informatif untuk refleksi awal",
    updatedAt: "02 Mei 2026",
    excerpt: "Memahami batas kapan sebuah perasaan masih bisa ditangani mandiri dan kapan saatnya berkonsultasi dengan psikolog.",
    fullBody: [
      "Wajar jika kita merasa sedih setelah gagal ujian atau patah hati. Perasaan sedih adalah bagian alami dari menjadi manusia.",
      "Namun, jika perasaan sedih atau hampa berlangsung berturut-turut lebih dari 2 minggu, membuatmu tidak bisa beraktivitas harian, atau mengganggu tidur dan makan, itu adalah sinyal tubuhmu membutuhkan bantuan profesional.",
      "Rangkul Cerita hadir sebagai jembatan awal untuk merapikan pikiranmu sebelum berkonsultasi dengan psikolog."
    ],
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "test-1",
    pseudonym: "Langit",
    age: 18,
    role: "Siswa SMA Kelas 12",
    city: "Bandung",
    story: "Awalnya aku cuma memilih emosi 'cemas' di mood checker. Setelah menulis beberapa menit di jurnal terpandu, aku baru sadar yang paling berat bukan tugas sekolahnya, tapi takut mengecewakan harapan orang tua.",
    featureUsed: "Mood Checker & Jurnal Terpandu",
    subjectiveOutcome: "Merasa lebih tenang dan bisa memisahkan beban pikiran",
    avatarSeed: "Langit",
  },
  {
    id: "test-2",
    pseudonym: "Alya",
    age: 20,
    role: "Mahasiswi Semester 4",
    city: "Yogyakarta",
    story: "Aku tipe orang yang susah ngomong kalau lagi panik. Template pesan di Rangkul Cerita ngebantu banget waktu aku bingung mau kirim chat apa ke konselor kampus. Rasanya lebih rapi dan nggak bikin tambah cemas.",
    featureUsed: "Template Pesan & Jembatan Dukungan Manusia",
    subjectiveOutcome: "Mendapatkan keberanian menghubungi rujukan konselor kampus",
    avatarSeed: "Alya",
  },
  {
    id: "test-3",
    pseudonym: "Bagas",
    age: 19,
    role: "Mahasiswa Perantau",
    city: "Surabaya",
    story: "Jurnal AI-nya kerasa hangat banget dan nggak sok tahu. Dia nggak langsung ngasih nasehat panjang lebar, tapi nanya satu pertanyaan kecil yang bikin aku mikir 'oh ternyata ini yang aku butuhin'.",
    featureUsed: "Jurnal AI Terpandu & Langkah Kecil",
    subjectiveOutcome: "Menemukan 1 langkah konkret setelah merasa burnout skripsi",
    avatarSeed: "Bagas",
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "Apakah Rangkul Cerita memberikan diagnosis kesehatan mental?",
    answer: "Sama sekali tidak. Rangkul Cerita adalah ruang refleksi awal dan alat literasi emosi. Kami tidak memberikan diagnosis, tidak mengkategorikan gangguan mental, dan tidak menyediakan resep obat. Jika kamu membutuhkan diagnosis medis, kami akan menyarankanmu untuk berkonsultasi dengan psikolog atau psikiater profesional.",
    category: "Umum",
  },
  {
    id: "faq-2",
    question: "Apakah panduan AI di Rangkul Cerita menggantikan psikolog?",
    answer: "Tidak. AI di Rangkul Cerita dirancang khusus hanya sebagai teman refleksi awal untuk membantu merapikan cerita dan mengenali emosi. AI kami memiliki batas ketat (safety guardrail) dan selalu mendorong pengguna untuk terhubung dengan dukungan manusia atau profesional ketika masalah terasa semakin berat.",
    category: "AI & Fitur",
  },
  {
    id: "faq-3",
    question: "Apakah saya harus mendaftar menggunakan nama asli?",
    answer: "Tidak perlu. Kamu bisa menggunakan nama samaran (alias) apa pun yang kamu suka. Kami menganut prinsip Identitas Minimum untuk menjaga kerahasiaan dan kenyamanan cerita pribadimu.",
    category: "Keamanan & Privasi",
  },
  {
    id: "faq-4",
    question: "Apakah cerita dan isi jurnal saya disimpan dan dijual?",
    answer: "Jurnal dan catatan yang belum kamu kirim untuk fitur AI tetap berada di browser perangkat ini secara lokal. Penyimpanan browser bukan vault terenkripsi. Saat kamu meminta refleksi AI, teks yang diperlukan dikirim ke server dan penyedia AI untuk diproses.",
    category: "Keamanan & Privasi",
  },
  {
    id: "faq-5",
    question: "Siapa saja yang dapat membaca jurnal saya?",
    answer: "Catatan yang tersimpan di browser perangkat ini tidak dikirim ke server sampai kamu meminta fitur AI. Karena browser storage bukan vault terenkripsi, orang yang memiliki akses ke perangkat atau profil browser dapat mengaksesnya.",
    category: "Keamanan & Privasi",
  },
  {
    id: "faq-6",
    question: "Apakah layanan dasar Rangkul Cerita gratis?",
    answer: "Ya! Fitur utama seperti Check-in Emosi, Jurnal AI Terpandu, Panduan Self-Help, dan Jalur Bantuan Krisis 100% gratis dan dapat diakses oleh siapa saja.",
    category: "Umum",
  },
  {
    id: "faq-7",
    question: "Apa yang terjadi jika saya sedang dalam situasi krisis atau bahaya?",
    answer: "Sistem pendeteksi keselamatan kami akan secara otomatis menghentikan aliran jurnal biasa dan mengaktifkan Modul Bantuan Krisis. Kamu akan langsung disajikan tombol telepon satu-klik ke nomor darurat resmi seperti Healing119 (119 ext 8) atau 112, serta petunjuk keselamatan praktis.",
    category: "Krisis & Bantuan",
  },
  {
    id: "faq-8",
    question: "Apa itu Peer Supporter di Rangkul Cerita?",
    answer: "Peer Supporter adalah rencana pendampingan dari sesama anak muda terlatih yang mendengarkan cerita dengan empati. Fitur ini belum tersedia saat ini dan masih dalam tahap perencanaan — kami akan mengumumkannya jika sudah siap diluncurkan.",
    category: "AI & Fitur",
  },
  {
    id: "faq-9",
    question: "Apakah pengguna di bawah umur (di bawah 18 tahun) boleh bergabung?",
    answer: "Boleh. Layanan ini dirancang khusus aman untuk remaja usia 16 tahun ke atas dengan panduan bahasa yang santun, bebas konten eksplisit, dan mengutamakan perlindungan anak serta koneksi ke pendamping tepercaya.",
    category: "Umum",
  },
  {
    id: "faq-10",
    question: "Bagaimana cara menghapus akun dan seluruh data saya?",
    answer: "Buka Pengaturan Privasi lalu pilih penghapusan data. Fitur ini hanya menghapus kunci penyimpanan Rangkul Cerita yang tersedia di browser perangkat ini; data atau layanan lain tidak disentuh.",
    category: "Keamanan & Privasi",
  },
];

export const PARTNERSHIP_PROGRAMS: PartnershipProgram[] = [
  {
    title: "Program Sekolah & Kampus Aman",
    target: "SMA, SMK, Universitas, BEM, & Unit Konseling",
    description: "Sediakan ruang refleksi terstruktur bagi siswa/mahasiswa di sekolah atau kampusmu.",
    features: [
      "Akses prioritas Rangkul Cerita untuk siswa & mahasiswa",
      "Laporan institusi belum tersedia pada MVP",
      "Materi workshop literasi emosi & penanganan stres",
      "Panduan dukungan guru BK / konselor kampus — dalam pengembangan"
    ],
  },
  {
    title: "Pelatihan Peer Supporter Komunitas",
    target: "Komunitas Pemuda, OSIS, & Yayasan Sosial",
    description: "Latih anggota komunitasmu menjadi pendengar yang empati, memahami batas peran pendamping, dan mahir melakukan rujukan keselamatan.",
    features: [
       "Kurikulum pendampingan sebaya dalam pengembangan",
      "Simulasi studi kasus penanganan krisis awal",
      "Sertifikat kepesertaan & supervisi berkala",
      "Akses modul fasilitator grup refleksi"
    ],
  },
];
