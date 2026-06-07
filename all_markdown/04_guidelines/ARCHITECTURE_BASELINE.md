# Architecture Baseline

## Tujuan
Dokumen ini mendefinisikan *baseline* arsitektur proyek Umbuddy V1 yang telah diselesaikan melalui refaktor Fase 1-13. Dokumen ini bertujuan menjadi panduan praktis dan wajib dipatuhi oleh seluruh developer serta agen AI pada masa pengembangan mendatang agar struktur dan konvensi *codebase* tetap bersih, tertata, dan modular.

## Refactor Checkpoint
Baseline ini ditetapkan dan ditandai pada Git Tag: `v0.1-architecture-baseline`.

## Ringkasan Arsitektur Baseline
Arsitektur Umbuddy menggunakan pendekatan **Feature-Based Architecture** untuk logika domain dan **Atomic Design** untuk komponen UI yang dapat digunakan kembali (*reusable*). Server dan Client dipisahkan secara ketat untuk menjamin keamanan, performa, dan skalabilitas.

## Tanggung Jawab Folder Utama
- `src/app`: Khusus untuk App Router (halaman dan layout).
- `src/app/api`: Khusus untuk *endpoint* API (hanya berisi file `route.ts`).
- `src/features`: Tempat utama menyimpan logika fitur dan komponen spesifik domain (Frontend & Server Components).
- `src/components`: Komponen UI modular (*shared UI*) dengan pendekatan Atomic Design.
- `src/server`: Logika spesifik *backend* (database, auth, API utils, validation, dan domain services).
- `src/lib`: Utilitas ringan dan murni (*generic utils*) yang bisa digunakan di client maupun server (contoh: *design tokens*).
- `src/integrations`: Integrasi sistem eksternal yang berjalan di sisi *client* atau pihak ketiga.
- `src/test`: Tempat penyimpanan semua berkas pengujian otomatis (*unit* maupun *integration test*).

## Aturan Feature-Based Architecture
Semua logika domain harus dikelompokkan ke dalam folder fitur, bukan dikelompokkan berdasarkan tipe file secara global.
- Fitur pengguna umum diletakkan di `src/features/user-*` (contoh: `user-practice`, `user-onboarding`).
- Fitur admin diletakkan di `src/features/admin-*` (contoh: `admin-dashboard`, `admin-questions`).
- Logika domain yang dibagikan antarsistem fitur diletakkan di `src/features/shared`.

**Contoh Struktur Fitur Pengguna (`src/features/user-example/`):**
```text
src/features/user-example/
├── user-example-flow.tsx
├── _components/
├── _hooks/
├── _services/
├── _schemas/
├── _types/
├── _constants/
└── _utils/
```

**Contoh Struktur Fitur Admin (`src/features/admin-example/`):**
```text
src/features/admin-example/
├── admin-example-flow.tsx
├── _components/
├── _services/
├── _schemas/
├── _types/
├── _constants/
└── _utils/
```

## Aturan Shared UI (Atomic Design)
Folder `src/components` HANYA untuk komponen antarmuka yang independen dari logika bisnis (bisa di-*reuse* lintas fitur).
- `src/components/ui`: UI primitif tingkat rendah (biasanya komponen Shadcn).
- `src/components/atoms`: Komponen kustom paling kecil dan sederhana (Button, Input).
- `src/components/molecules`: Gabungan beberapa *atoms* (Search Bar, Form Field).
- `src/components/organisms`: Blok UI besar yang dapat di-*reuse* (Navbar, Footer, Card kompleks).
- `src/components/templates`: Struktur susunan layout (*layout scaffolds*).
- **Aturan:** Bangun UI bersama dari hierarki terendah (*atoms* → *molecules* → *organisms* → *templates*) ketika masuk akal.

## Aturan App Router (`src/app`)
- **Route-only:** Folder ini hanya mengatur *routing* Next.js (seperti `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Komponen di `app/` murni bertindak sebagai titik masuk (*entry point*) dan akan mengimpor komponen *-flow.tsx* (sebagai *Server Component* orkestrator) dari `src/features/*`.

**Contoh App Route:**
```text
src/app/(user)/example/page.tsx
→ imports and renders src/features/user-example/user-example-flow.tsx
```

## Aturan API Route (`src/app/api`)
- **Thin Handlers:** Setiap direktori API **HANYA BOLEH** berisi berkas `route.ts`.
- Dilarang keras menempatkan `_utils.ts`, `dto.ts`, skema, atau fungsi bantuan apa pun di dalam `src/app/api`.
- Berkas `route.ts` hanya bertugas mem-parsing HTTP *request*, memvalidasi, memanggil service dari `src/server`, dan mengembalikan HTTP *response*.

**Contoh API Route:**
```text
src/app/api/v1/example/route.ts
→ parses request, validates, calls src/server service, returns response
```

## Aturan Lapis Server (`src/server`)
- Segala logika bisnis *backend*, akses database (Prisma), operasi Redis, layanan *email*, sistem Autentikasi (NextAuth), dan *route utilities* wajib bermukim di dalam `src/server`.
- Fungsi pembantu API *endpoint* yang dibagi secara umum diletakkan di `src/server/api/route-utils.ts`. Utilitas khusus domain API diletakkan di `src/server/api/[domain].route-utils.ts`.

## Aturan Validasi dan DTO
- Definisi skema *server validation* / DTO (seperti Zod schemas) untuk rute API WAJIB ditempatkan di `src/server/validation/`.
- Jika skema tersebut juga digunakan oleh *client* (sebagai validasi form *frontend*), maka letakkan di dalam folder fitur terkait pada bagian `_schemas` (contoh: `src/features/admin-auth/_schemas`).

## Aturan Lib dan Integrations
- `src/lib`: Hanya digunakan untuk fungsi utilitas generik ringan yang aman untuk *client* dan *server* (misalnya pembacaan *design tokens* atau pemformatan utilitas murni).
- `src/integrations`: Hanya digunakan untuk pustaka *client* eksternal dan perantara API sistem pihak ketiga yang berjalan secara spesifik di sisi *browser/client*.

## Aturan Pengujian (Testing)
- Seluruh spesifikasi tes, file *mock*, dan pengujian dipertahankan berpusat dalam `src/test`. Hal ini menjaga kebersihan pohon direktori *source code* serta sesuai dengan konfigurasi Vitest pada proyek ini.

## Aturan Komentar dan Dokumentasi
- Komentar dalam *codebase*, *pull request*, maupun dokumen spesifikasi **wajib menggunakan Bahasa Indonesia** yang baku namun komunikatif.
- Dokumentasi struktural dan *markdown files* yang digunakan agen dan developer wajib diletakkan di dalam folder utama `all_markdown/` sesuai kategorinya. **Jangan pernah membuat folder `docs/`**.

## Checklist Fitur Baru
- [ ] Buat direktori di dalam `src/features/` berdasarkan tipe fitur (contoh: `user-[nama-fitur]` atau `admin-[nama-fitur]`).
- [ ] Buat file *Server Component* orkestrator (seperti `[nama]-flow.tsx`).
- [ ] Simpan komponen UI spesifik pada folder `_components/` di dalam fitur, bukan di `src/components/`.
- [ ] Pastikan layanan backend API terdaftar di `src/server/`.
- [ ] Buat rute di `src/app` dengan mengekspor *page* yang memuat `-flow.tsx`.
- [ ] Pastikan UI primitif yang *reusable* telah diletakkan di `src/components/` menggunakan standar *Atomic Design*.

## Checklist Revisi / Penyesuaian
- [ ] Cek ulang apakah ada utilitas API yang berada di folder *route* alih-alih `src/server`.
- [ ] Pastikan tidak ada komponen *client* yang membocorkan lingkungan *server* (contoh: *import* `prisma` atau `next-auth` di `use client`).
- [ ] Pastikan *import* `_utils` lokal sesuai peruntukannya dan tidak ada *cross-import* lintas domain tanpa alasan valid.

## Pola yang Terlarang (Forbidden Patterns)
- ❌ Meng-*import* dari `src/server/*` di dalam *Client Components* (`"use client"`).
- ❌ Menyimpan komponen UI spesifik suatu fitur/halaman di dalam `src/components`. (Harus masuk `src/features/*/_components`).
- ❌ Meng-*import* kode dari `src/features` di dalam komponen *Shared UI* (`src/components`). Komponen UI murni tidak boleh bergantung pada fitur.
- ❌ Menempatkan file selain `route.ts` di dalam jalur URI `src/app/api`.
- ❌ Menulis logika *database* secara langsung di dalam rute API alih-alih mendelegasikannya ke *service* di `src/server`.

## Perintah Validasi Wajib
Semua refaktorisasi maupun pembuatan fitur baru wajib lolos validasi berikut secara mutlak:
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Referensi Git Checkpoint
Kembalikan proyek ke versi sebelum adanya penambahan fitur baru apabila terdapat eksperimen yang merusak struktur ke *checkpoint* V1:
`git checkout v0.1-architecture-baseline`
