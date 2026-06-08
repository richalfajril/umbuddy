import { getServerSession } from "next-auth";
import { authConfig } from "./config";
import { cache } from "react";

// Mengambil session pengguna dari NextAuth dengan konfigurasi server yang sama.
export async function getUserSession() {
  return await getServerSession(authConfig);
}

// Membungkus getUserSession dengan React cache agar aman dipanggil berulang di dalam siklus render Server Components.
export const getCachedUserSession = cache(async () => {
  return await getUserSession();
});
