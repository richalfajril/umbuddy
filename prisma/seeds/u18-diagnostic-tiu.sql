-- U18 diagnostic seed: 5 TIU questions.
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
  'TIU',
  'U18_DIAGNOSTIC_TIU',
  1,
  'TANGAN : TUBUH = DAHAN : ....',
  '{
    "A": "Pohon",
    "B": "Rindang",
    "C": "Daun",
    "D": "Ranting",
    "E": "Buah"
  }'::jsonb,
  'A',
  'Hubungan kata pada soal ini adalah bagian dari. Tangan merupakan bagian dari tubuh, maka dengan pola yang sama, dahan merupakan bagian dari pohon.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TIU',
  'U18_DIAGNOSTIC_TIU',
  2,
  '2, 3, 5, 8, 13, 21, 34, ...',
  '{
    "A": "45",
    "B": "52",
    "C": "55",
    "D": "63",
    "E": "68"
  }'::jsonb,
  'C',
  'Deret ini merupakan pola Fibonacci, yaitu suku berikutnya diperoleh dengan menjumlahkan dua suku sebelumnya. Setelah 21 dan 34, suku berikutnya adalah 21 + 34 = 55.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TIU',
  'U18_DIAGNOSTIC_TIU',
  3,
  'Semua karyawan mendapat gaji. Sebagian karyawan mendapat bonus. Kesimpulan yang tepat adalah ...',
  '{
    "A": "Semua karyawan mendapat gaji dan bonus.",
    "B": "Karyawan yang mendapat bonus tidak mendapat gaji.",
    "C": "Sebagian karyawan mendapat gaji dan bonus.",
    "D": "Karyawan yang tidak mendapat bonus tidak mendapat gaji.",
    "E": "Semua yang mendapat bonus bukan karyawan."
  }'::jsonb,
  'C',
  'Premis pertama menyatakan semua karyawan mendapat gaji. Premis kedua menyatakan sebagian karyawan mendapat bonus. Karena semua karyawan pasti mendapat gaji, maka sebagian karyawan yang mendapat bonus tersebut juga mendapat gaji.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TIU',
  'U18_DIAGNOSTIC_TIU',
  4,
  'Delapan pekerja bangunan membutuhkan waktu 12 hari untuk menyelesaikan sebuah proyek. Jika proyek tersebut harus selesai dalam waktu 4 hari, berapa banyak pekerja yang dibutuhkan?',
  '{
    "A": "16 orang",
    "B": "24 orang",
    "C": "32 orang",
    "D": "36 orang",
    "E": "48 orang"
  }'::jsonb,
  'B',
  'Soal ini memakai perbandingan berbalik nilai. Total beban kerja adalah 8 x 12 = 96 pekerja-hari. Jika harus selesai dalam 4 hari, pekerja yang dibutuhkan adalah 96 / 4 = 24 orang.',
  'onboarding',
  'PUBLISHED',
  'seed:u18',
  'seed:u18'
),
(
  'TIU',
  'U18_DIAGNOSTIC_TIU',
  5,
  'Manakah yang tidak termasuk ke dalam kelompoknya?',
  '{
    "A": "AC",
    "B": "Kulkas",
    "C": "Kipas Angin",
    "D": "Blender",
    "E": "Televisi"
  }'::jsonb,
  'E',
  'AC, kulkas, kipas angin, dan blender merupakan peralatan elektronik rumah tangga yang fungsi utamanya berkaitan dengan pengubah suhu atau kerja mekanis. Televisi berbeda karena fungsi utamanya adalah media informasi, komunikasi, dan hiburan audio-visual.',
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
