-- U18 diagnostic seed: 5 TKP questions.
-- Idempotent by (package_code, number); safe to re-run.

insert into questions (
  category,
  package_code,
  number,
  text,
  options,
  answer_key,
  tkp_weights,
  explanation,
  difficulty,
  status,
  created_by,
  updated_by
) values
(
  'TKP',
  'U18_DIAGNOSTIC_TKP',
  1,
  'Anda adalah seorang pegawai bidang kesehatan. Seorang pasien datang ke loket Anda dan marah-marah karena merasa pelayanan yang diberikan lambat, padahal Anda sudah bekerja sesuai dengan prosedur yang ditetapkan. Sikap Anda menghadapi situasi ini adalah...',
  '{
    "A": "Menjelaskan kepadanya bahwa pelayanan di loket ini sudah sesuai dengan prosedur operasional standar yang berlaku di instansi.",
    "B": "Meminta maaf atas ketidaknyamanan tersebut, mendengarkan keluhannya, dan berusaha membantunya agar prosesnya bisa lebih cepat.",
    "C": "Tetap tenang, mengabaikan kemarahannya, dan melanjutkan pekerjaan Anda agar antrean di belakangnya tidak semakin panjang.",
    "D": "Memanggil petugas keamanan (satpam) untuk mengamankan pasien tersebut karena dinilai telah mengganggu ketertiban pelayanan.",
    "E": "Meminta rekan kerja lain yang sedang senggang untuk melayani pasien tersebut agar situasi tidak semakin memanas."
  }'::jsonb,
  null,
  '{
    "A": 3,
    "B": 5,
    "C": 2,
    "D": 1,
    "E": 4
  }'::jsonb,
  'Soal ini menguji aspek pelayanan publik. Nilai tertinggi berada pada pilihan B karena menunjukkan sikap responsif, empati terhadap ketidaknyamanan pengguna layanan, serta proaktif dalam memberikan solusi tanpa melanggar regulasi. Pilihan E cukup baik sebagai alternatif kerja tim, sedangkan pilihan D terlalu reaktif dan tidak mencerminkan keramahan dalam pelayanan publik.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TKP',
  'U18_DIAGNOSTIC_TKP',
  2,
  'Anda sedang dikejar tenggat waktu untuk menyelesaikan laporan bulanan yang sangat penting. Tiba-tiba, komputer yang biasa Anda gunakan mengalami kendala teknis dan mati total, padahal waktu pengumpulan tinggal 2 jam lagi. Tindakan yang Anda lakukan adalah...',
  '{
    "A": "Melaporkan kejadian tersebut kepada atasan dan meminta kelonggaran waktu pengumpulan karena adanya kendala teknis.",
    "B": "Menghubungi bagian teknisi TI kantor dan menunggu mereka datang memperbaiki komputer Anda sambil beristirahat sejenak.",
    "C": "Segera mencari rekan kerja yang sedang tidak menggunakan komputernya untuk meminjam komputer tersebut demi menyelesaikan laporan Anda tepat waktu.",
    "D": "Merasa panik dan kesal karena menganggap nasib buruk sedang menimpa Anda di waktu yang tidak tepat.",
    "E": "Membawa komputer tersebut ke tempat servis di luar kantor dengan biaya sendiri agar bisa cepat selesai."
  }'::jsonb,
  null,
  '{
    "A": 3,
    "B": 2,
    "C": 5,
    "D": 1,
    "E": 4
  }'::jsonb,
  'Soal ini menguji profesionalisme dan problem solving. Nilai tertinggi adalah C karena menunjukkan urgensi, tanggung jawab terhadap tugas, serta inisiatif cepat mencari solusi alternatif agar pekerjaan tetap selesai tepat waktu. Pilihan A menunjukkan kurangnya usaha mandiri sebelum meminta kelonggaran, sedangkan pilihan D mencerminkan ketidakmatangan emosi dalam bekerja.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TKP',
  'U18_DIAGNOSTIC_TKP',
  3,
  'Instansi Anda kedatangan beberapa pegawai baru yang ditempatkan di unit kerja Anda. Sebagian dari mereka terlihat masih canggung dan sungkan untuk berinteraksi dengan pegawai senior. Sebagai pegawai yang sudah lama di unit tersebut, apa yang akan Anda lakukan?',
  '{
    "A": "Membiarkan saja mereka beradaptasi secara alami seiring berjalannya waktu karena setiap orang pasti mengalami fase tersebut.",
    "B": "Menunggu mereka menyapa atau bertanya terlebih dahulu kepada Anda, baru kemudian Anda meresponsnya dengan ramah.",
    "C": "Menyapa mereka terlebih dahulu saat berpapasan, memperkenalkan diri, dan menawarkan bantuan jika mereka mengalami kesulitan terkait pekerjaan.",
    "D": "Mengajak rekan-rekan sesama pegawai senior untuk mengadakan rapat formal guna menyambut para pegawai baru tersebut.",
    "E": "Menyuruh mereka melakukan pekerjaan-pekerjaan ringan terlebih dahulu agar mereka terbiasa dengan ritme kerja di kantor."
  }'::jsonb,
  null,
  '{
    "A": 2,
    "B": 3,
    "C": 5,
    "D": 4,
    "E": 1
  }'::jsonb,
  'Soal ini menguji kemampuan jejaring kerja. Nilai penuh didapat pada pilihan C karena menunjukkan keterbukaan, inisiatif positif untuk membangun hubungan kerja yang kondusif, serta sikap suportif terhadap rekan tim baru. Pilihan D juga baik namun terlalu formal, sementara pilihan E terkesan memanfaatkan situasi kerja secara tidak profesional.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TKP',
  'U18_DIAGNOSTIC_TKP',
  4,
  'Anda ditunjuk menjadi ketua panitia perayaan HUT instansi. Di dalam tim kerja Anda, terdapat anggota-anggota yang berasal dari berbagai latar belakang suku, budaya, dan agama yang berbeda. Dalam menentukan konsep acara, terjadi perbedaan pendapat yang cukup tajam di antara mereka. Sikap Anda adalah...',
  '{
    "A": "Mengambil alih keputusan dan menentukan sendiri konsep acara yang menurut Anda paling netral dan aman bagi semua pihak.",
    "B": "Mengadakan rapat khusus untuk mendengarkan masukan dari semua pihak, lalu memfasilitasi musyawarah demi mencapai konsep acara yang menghargai keberagaman.",
    "C": "Memilih pendapat kelompok yang memiliki jumlah anggota mayoritas di dalam kepanitiaan agar keputusan bisa diambil lebih cepat.",
    "D": "Meminta atasan langsung untuk memutuskan konsep acara mana yang harus dipilih agar tidak ada anggota yang menyalahkan Anda.",
    "E": "Menunda pelaksanaan rapat sampai situasi mendingin dengan sendirinya tanpa intervensi apa pun."
  }'::jsonb,
  null,
  '{
    "A": 3,
    "B": 5,
    "C": 2,
    "D": 4,
    "E": 1
  }'::jsonb,
  'Soal ini menilai aspek sosial budaya dan kepemimpinan dalam keberagaman. Pilihan B adalah tindakan terbaik karena mengedepankan komunikasi, menghargai perbedaan latar belakang, dan mengutamakan musyawarah untuk mencapai mufakat yang inklusif. Pilihan D cukup aman namun kurang menunjukkan kemandirian sebagai ketua, sedangkan pilihan C berpotensi memicu diskriminasi kelompok minoritas.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TKP',
  'U18_DIAGNOSTIC_TKP',
  5,
  'Atasan Anda mengumumkan bahwa mulai bulan depan, seluruh sistem pelaporan kinerja pegawai akan beralih menggunakan aplikasi digital berbasis cloud. Anda sendiri selama ini terbiasa menggunakan metode pencatatan manual. Sikap Anda menghadapi perubahan ini adalah...',
  '{
    "A": "Menerima keputusan tersebut dan berencana mempelajarinya nanti jika aplikasi tersebut sudah resmi diterapkan di kantor.",
    "B": "Meminta izin kepada atasan untuk tetap menggunakan metode manual khusus untuk Anda karena faktor kebiasaan dan usia.",
    "C": "Menyambut baik perubahan tersebut dan segera meluangkan waktu untuk mempelajari cara penggunaan aplikasi baru melalui panduan atau rekan yang lebih paham.",
    "D": "Menyarankan kepada rekan-rekan kerja untuk mengajukan protes bersama karena perubahan sistem dirasa terlalu mendadak.",
    "E": "Mengikuti pelatihan yang disediakan kantor dengan terpaksa demi menggugurkan kewajiban."
  }'::jsonb,
  null,
  '{
    "A": 4,
    "B": 2,
    "C": 5,
    "D": 1,
    "E": 3
  }'::jsonb,
  'Soal ini menguji aspek teknologi informasi dan komunikasi serta kemampuan beradaptasi terhadap perubahan. Pilihan C mendapat nilai tertinggi karena mencerminkan sikap terbuka, proaktif, dan antusias dalam meningkatkan literasi digital demi mendukung efektivitas kerja instansi. Pilihan A juga positif namun kurang menunjukkan inisiatif awal, sedangkan pilihan D menunjukkan resistensi total terhadap kemajuan teknologi.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
)
on conflict (package_code, number) do update set
  category = excluded.category,
  text = excluded.text,
  options = excluded.options,
  answer_key = excluded.answer_key,
  tkp_weights = excluded.tkp_weights,
  explanation = excluded.explanation,
  difficulty = excluded.difficulty,
  status = excluded.status,
  updated_by = excluded.updated_by,
  updated_at = now();
