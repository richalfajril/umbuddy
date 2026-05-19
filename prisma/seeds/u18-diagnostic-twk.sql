-- U18 diagnostic seed: 5 TWK questions.
-- Idempotent by (package_code, number); safe to re-run.

insert into questions (
  category,
  package_code,
  number,
  text,
  options,
  answer_key,
  explanation,
  difficulty,
  status,
  created_by,
  updated_by
) values
(
  'TWK',
  'U18_DIAGNOSTIC_TWK',
  1,
  'Salah satu tantangan terbesar nasionalisme bangsa Indonesia di era globalisasi adalah memudarnya kecintaan generasi muda terhadap budaya lokal akibat derasnya arus budaya asing. Upaya paling efektif yang dapat dilakukan oleh lingkungan sekolah untuk membendung dampak negatif tersebut adalah ...',
  '{
    "A": "Melarang secara ketat siswa membawa gawai (smartphone) ke sekolah.",
    "B": "Mewajibkan siswa untuk hanya mendengarkan musik tradisional di area sekolah.",
    "C": "Mengintegrasikan nilai-nilai budaya lokal ke dalam kegiatan ekstrakurikuler dan pembelajaran yang dikemas secara modern.",
    "D": "Menutup diri dari segala bentuk kerja sama pendidikan dengan lembaga asing.",
    "E": "Memberikan sanksi tegas bagi siswa yang ketahuan meniru gaya hidup kebarat-baratan."
  }'::jsonb,
  'C',
  'Nasionalisme di era globalisasi tidak dihadapi dengan cara menutup diri secara ekstrem atau memberikan sanksi yang represif. Langkah paling efektif dan adaptif adalah menanamkan kecintaan budaya lokal melalui metode yang relevan dengan generasi muda, yaitu mengintegrasikannya ke dalam pembelajaran dan ekstrakurikuler secara menarik dan modern agar mereka bangga terhadap identitas bangsanya tanpa tertinggal oleh zaman.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TWK',
  'U18_DIAGNOSTIC_TWK',
  2,
  'Mahkamah Konstitusi (MK) memiliki peran penting dalam menjaga sistem ketatanegaraan Indonesia. Berdasarkan Pasal 24C Ayat (1) UUD 1945, salah satu kewenangan yang dimiliki oleh Mahkamah Konstitusi adalah ...',
  '{
    "A": "Menguji peraturan perundang-undangan di bawah undang-undang terhadap undang-undang.",
    "B": "Memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh Undang-Undang Dasar.",
    "C": "Mengusulkan pengangkatan hakim agung kepada Dewan Perwakilan Rakyat.",
    "D": "Melakukan pengawasan terhadap perilaku dan martabat para hakim di seluruh peradilan.",
    "E": "Memberikan pertimbangan kepada Presiden dalam hal pemberian grasi dan rehabilitasi."
  }'::jsonb,
  'B',
  'Berdasarkan Pasal 24C Ayat (1) UUD 1945, kewenangan MK meliputi menguji undang-undang terhadap UUD, memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh UUD, memutus pembubaran partai politik, dan memutus perselisihan hasil pemilihan umum. Pilihan A adalah wewenang MA, pilihan C dan D adalah wewenang KY, sedangkan pilihan E adalah wewenang MA.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TWK',
  'U18_DIAGNOSTIC_TWK',
  3,
  'Seorang aparatur sipil negara (ASN) ditugaskan untuk menjadi panitia pengadaan barang dan jasa di instansinya. Salah satu vendor peserta tender yang merupakan kerabat dekatnya menjanjikan sejumlah uang jika perusahaannya dimenangkan. ASN tersebut menolak dengan tegas dan tetap memproses tender sesuai dengan prosedur yang berlaku. Sikap ASN ini mencerminkan penerapan prinsip integritas, yaitu ...',
  '{
    "A": "Objektivitas dan profesionalisme dalam menjalankan tugas penugasan.",
    "B": "Keberanian menentang arus demi kepentingan golongan sendiri.",
    "C": "Kedisiplinan waktu dalam menyelesaikan pelaporan tender.",
    "D": "Kesetiaan kepada pimpinan institusi tempatnya bekerja.",
    "E": "Kepedulian terhadap kelangsungan bisnis kerabatnya."
  }'::jsonb,
  'A',
  'Integritas menekankan keselarasan antara tindakan dengan nilai moral, etika, dan aturan yang berlaku. Menolak suap atau gratifikasi dan mengabaikan kedekatan personal demi menjalankan prosedur yang adil merupakan wujud sikap objektif dan profesional.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TWK',
  'U18_DIAGNOSTIC_TWK',
  4,
  'Upaya bela negara bagi seorang warga negara pada hakikatnya tidak selalu berarti memanggul senjata menghadapi musuh, melainkan disesuaikan dengan profesi dan pengabdian masing-masing. Berikut ini yang merupakan contoh penanganan bela negara secara non-fisik bagi seorang mahasiswa adalah ...',
  '{
    "A": "Mengikuti demonstrasi anarkis untuk menjatuhkan kebijakan pemerintah yang sah.",
    "B": "Melakukan penelitian ilmiah dan inovasi teknologi yang bermanfaat bagi kemandirian bangsa.",
    "C": "Membatasi diri dari pergaulan dengan mahasiswa yang berasal dari daerah atau suku lain.",
    "D": "Mengikuti wajib militer yang diselenggarakan secara rahasia oleh organisasi tertentu.",
    "E": "Menolak mempelajari bahasa asing karena dianggap mengurangi rasa cinta tanah air."
  }'::jsonb,
  'B',
  'Bela negara bagi mahasiswa secara non-fisik diwujudkan melalui peningkatan kompetensi, prestasi, dan kontribusi nyata yang membangun bangsa. Melakukan penelitian dan menciptakan inovasi teknologi yang mendorong kemandirian nasional merupakan bentuk kontribusi nyata di bidang pendidikan dan teknologi.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TWK',
  'U18_DIAGNOSTIC_TWK',
  5,
  'Konflik sosial yang berlatar belakang perbedaan suku, agama, ras, dan antargolongan (SARA) seringkali mengancam keutuhan NKRI. Upaya penyelesaian konflik tersebut yang paling selaras dengan pengamalan nilai-nilai Sila Keempat Pancasila adalah ...',
  '{
    "A": "Meminta aparat keamanan untuk membubarkan kedua kelompok yang bertikai secara paksa.",
    "B": "Memenangkan kelompok yang memiliki jumlah massa paling banyak demi meredam kerusuhan.",
    "C": "Mengadakan dialog terbuka dan musyawarah yang melibatkan tokoh adat, tokoh agama, serta perwakilan kedua belah pihak untuk mencapai rekonsiliasi.",
    "D": "Menyerahkan sepenuhnya penyelesaian masalah kepada pihak asing sebagai mediator netral.",
    "E": "Mengisolasi wilayah konflik agar dampaknya tidak meluas ke daerah-daerah sekitar."
  }'::jsonb,
  'C',
  'Sila Keempat Pancasila menekankan prinsip kerakyatan, hikmat kebijaksanaan, dan musyawarah untuk mufakat. Menghadapi konflik sosial, langkah yang paling sesuai adalah mengutamakan dialog, duduk bersama, dan musyawarah demi mencapai mufakat atau perdamaian tanpa menggunakan jalan kekerasan.',
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
  explanation = excluded.explanation,
  difficulty = excluded.difficulty,
  status = excluded.status,
  updated_by = excluded.updated_by,
  updated_at = now();
