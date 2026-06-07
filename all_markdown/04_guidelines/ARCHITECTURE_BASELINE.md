# Umbuddy Architecture Baseline

## Tujuan Dokumen
Dokumen ini mendefinisikan *baseline* arsitektur proyek Umbuddy V1 pasca-refaktor Fase 1-13. Dokumen ini menjadi satu-satunya sumber kebenaran (Single Source of Truth) untuk standar pengembangan, batasan sistem, dan panduan operasional. Seluruh developer serta agen AI wajib mengikuti aturan di dokumen ini pada masa pengembangan mendatang agar *codebase* tetap bersih, tertata, dan modular.

## Checkpoint Arsitektur
Baseline ini secara resmi ditetapkan pada Git Tag: `v0.1-architecture-baseline`.
Jika terjadi kerusakan struktural akibat eksperimen, Anda selalu dapat mengembalikan proyek ke keadaan ini melalui: `git checkout v0.1-architecture-baseline`.

## Ringkasan Baseline
Arsitektur Umbuddy menggunakan pendekatan **Feature-Based Architecture** untuk logika domain utama dan **Atomic Design** untuk komponen antarmuka (*shared UI*). Lapisan Server dan Client dipisahkan dengan sangat ketat (melalui `src/server` dan `src/features`) untuk menjamin keamanan, performa, skalabilitas, serta mencegah kebocoran *secret keys*.

## Tanggung Jawab Folder Final
- `src/app`: Khusus untuk App Router (hanya routing halaman dan layout).
- `src/app/api`: Khusus untuk *endpoint* API (hanya berisi file `route.ts`).
- `src/features`: Tempat utama menyimpan logika fitur spesifik domain (Frontend UI & Server Components/Flows).
- `src/components`: Komponen UI modular (*shared UI*) yang bisa di-*reuse* lintas fitur.
- `src/server`: Logika spesifik *backend* murni (Database Prisma, Auth, API Utils, Validation, dan Domain Services).
- `src/lib`: Utilitas ringan dan murni (*generic utils*) yang bisa digunakan dengan aman di client dan server (contoh: *design tokens*, *fonts*).
- `src/integrations`: Integrasi eksternal pihak ketiga yang berjalan di sisi *client* atau browser.
- `src/test`: Pusat dari semua spesifikasi pengujian otomatis (Vitest) beserta *mocks*.

## Feature-Based Architecture
Semua logika domain harus dikelompokkan ke dalam folder fitur berdasarkan tujuannya.
- **Fitur Pengguna**: `src/features/user-*` (contoh: `user-practice`, `user-onboarding`).
- **Fitur Admin**: `src/features/admin-*` (contoh: `admin-dashboard`, `admin-questions`).
- **Fitur Lintas Domain**: `src/features/shared`.

**Contoh Struktur Fitur (`src/features/user-example/`):**
```text
src/features/user-example/
├── user-example-flow.tsx   <-- Server Component orchestrator
├── _components/            <-- UI spesifik fitur ini
├── _hooks/                 <-- Hooks spesifik fitur
├── _services/              <-- Logika client/service lokal
├── _schemas/               <-- Zod validation untuk form client
├── _types/                 <-- Tipe data spesifik
├── _constants/             <-- Konstanta lokal
└── _utils/                 <-- Fungsi utilitas lokal
```

## Atomic Design untuk Shared UI
Folder `src/components` **HANYA BOLEH** berisi UI primitif dan agnostik yang independen dari logika fitur.
- `src/components/ui`: UI primitif dasar (biasanya integrasi komponen Shadcn).
- `src/components/atoms`: Komponen terkecil (*Button*, *Input*, *Badge*).
- `src/components/molecules`: Gabungan *atoms* sederhana (*SearchBar*, *FormField*).
- `src/components/organisms`: Blok UI besar mandiri (*Navbar*, *Card* kompleks).
- `src/components/templates`: Kerangka struktur (*scaffolds layout*).

## App Router Rules
- Direktori `src/app` adalah *route-only*.
- Komponen di dalam `app/` (seperti `page.tsx`, `layout.tsx`) berfungsi sebagai *entry point* URL yang merender komponen dari `src/features/*`.

**Contoh yang Benar:**
```tsx
// src/app/(user)/example/page.tsx
import { ExampleFlow } from '@/features/user-example/user-example-flow'

export default function ExamplePage() {
  return <ExampleFlow />
}
```

## API Route Rules
- Setiap folder API **HANYA BOLEH** berisi file `route.ts`. Tidak boleh ada fungsi *helper* (`_utils.ts`) atau DTO di dalam `src/app/api/v1/`.
- API Handlers bersifat "Thin Route": mereka hanya bertugas melakukan *parsing request*, memanggil layanan (Service) di `src/server`, dan mengembalikan HTTP *response*.

**Contoh yang Benar:**
```tsx
// src/app/api/v1/example/route.ts
import { ExampleService } from '@/server/example'
import { apiErrorResponse } from '@/server/api/route-utils'

export async function POST(req: Request) {
  try {
     const data = await ExampleService.process()
     return NextResponse.json(data)
  } catch (error) {
     return apiErrorResponse('ERROR_CODE', 'Terjadi kesalahan', 400)
  }
}
```

## Server Layer Rules
- Segala bentuk logika bisnis internal, akses database Prisma, otentikasi NextAuth, operasi cache Redis, dan fungsi email WAJIB diletakkan di `src/server`.
- Fungsi *helper* API yang digunakan bersama (seperti penanganan *error* umum) diletakkan di `src/server/api/route-utils.ts`. Utilitas API spesifik domain masuk ke `src/server/api/[domain].route-utils.ts`.

## Validation dan DTO Rules
- Definisi validasi keamanan API (DTOs) dan skema parameter *backend* diletakkan di `src/server/validation/`.
- Jika skema Zod tersebut dibagi dengan *client* (contohnya form React Hook Form), letakkan di folder fitur yang bersangkutan (`src/features/[fitur]/_schemas/`).

## Lib dan Integrations Rules
- Jangan jadikan `src/lib` sebagai keranjang sampah. Hanya letakkan *utility functions* primitif (pemformat tanggal murni, *design-tokens*) di sini.
- Integrasi SDK khusus yang berjalan di browser (contoh: *analytics client*) masuk ke `src/integrations`.

## Testing Rules
- Seluruh pengujian (Unit Tests dan Integration Tests) wajib berada dalam `src/test/`. Ini mendukung struktur konvensi Vitest terpusat kita yang sudah sangat efisien.

## Documentation dan Comment Rules
- Semua dokumentasi (termasuk *markdown* di `all_markdown/`), komentar spesifikasi kode (*JSDoc*), pesan *commit*, dan percakapan PR **wajib menggunakan Bahasa Indonesia**.
- Penjelasan harus ringkas, praktis, serta langsung menuju alasan (*why*) daripada mengulang kode (*what*). Dilarang membuat folder `docs/` terpisah.

---

## Instruksi Default untuk AI/Developer
Jika Anda adalah agen AI atau developer yang baru mulai bekerja di repositori ini, Anda **WAJIB MENGINGAT** aturan-aturan operasional di bawah ini sebelum menulis sebaris kode pun.

**Rules Utama:**
1. `src/app` is route-only (hanya untuk routing Next.js).
2. `src/app/api` **must** contain `route.ts` handlers only. (Tidak boleh ada `_utils` atau DTO di dalam rute API).
3. API handlers must stay thin and delegate logic to `src/server`.
4. User features go to `src/features/user-*`.
5. Admin features go to `src/features/admin-*`.
6. Shared feature logic goes to `src/features/shared`.
7. Shared reusable UI goes to `src/components` using Atomic Design (*atoms*, *molecules*, *organisms*, *templates*).
8. Server-only logic (Prisma, Auth, Redis, Services) goes to `src/server`.
9. DTO/server validation goes to `src/server/validation`.
10. Lightweight generic utilities only go to `src/lib`.
11. Browser external integrations go to `src/integrations`.
12. **Do not** import `src/server` from Client Components (`"use client"`). Server imports hanya valid di dalam Server Components.
13. **Do not** put feature-specific UI into `src/components`. (UI spesifik fitur wajib masuk ke `src/features/*/_components`).
14. **Do not** let shared UI (`src/components`) import from `src/features`. UI Shared harus 100% independen/agnostik.
15. Comments/docs **must** use Bahasa Indonesia and match the existing project style.

## Checklist Sebelum Editing
- [ ] Inspeksi file atau folder lain yang serupa dengan yang ingin dikerjakan untuk meniru konvensi yang sudah ada.
- [ ] Rangkum (*summarize*) rencana perubahan terlebih dahulu.
- [ ] Identifikasi dan catat daftar file yang akan dibuat atau dimodifikasi.
- [ ] Identifikasi *risky areas* (contoh: perubahan skema, manipulasi otentikasi) dan validasi kembali apakah sesuai batas arsitektur.

## Checklist Setelah Editing
Setelah mengedit kode, jalankan kompilasi validasi penuh (dilarang *commit* jika gagal):
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Aturan Fitur Baru
- **Fitur Pengguna:** Buat folder `src/features/user-[nama]/`. Buat *entry point* `user-[nama]-flow.tsx` (sebagai Server Component pengambil data). Panggil flow ini dari `src/app/[route]/page.tsx`.
- **Fitur Admin:** Buat folder `src/features/admin-[nama]/`. Gunakan helper autentikasi admin di `src/server/admin-auth`. Panggil flow dari `src/app/admin/[route]/page.tsx`.
- **Shared UI:** Jika UI dijamin dapat digunakan ulang lintas halaman, masukkan secara hierarkis ke `src/components/[atoms|molecules|organisms]/`.
- **Backend Service:** Segala logika manipulasi data baru WAJIB dibuat sebagai class/method independen di `src/server/[nama-service]/` dan dipanggil dari API Routes atau Server Components.

## Forbidden Patterns
- ❌ **Client Server Leak:** Meng-*import* dari `src/server/*` di dalam *Client Components* (`"use client"`). Ini fatal dan merusak kompilasi Turbopack.
- ❌ **Bloated Routes:** Menulis query database Prisma secara langsung di dalam file `src/app/api/.../route.ts` alih-alih di `src/server/`.
- ❌ **UI Dependency Inversion:** Membuat komponen di `src/components/` meng-*import* *state* atau fungsi dari `src/features/`. Komponen shared wajib bersifat "dungu" (*dumb*) dan hanya mengandalkan *props*.
- ❌ **Non-Route API Files:** Menempatkan fungsi bantuan utilitas API berdampingan dengan `route.ts`. Pindahkan semua pembantu ke `src/server/api/`.

## Command Validasi Wajib
Semua penambahan kode wajib diakhiri dengan menjalankan keempat instruksi validasi di bawah ini:
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
