import { getServerSession } from "next-auth";
import { authConfig } from "./config";

// Mengambil session pengguna dari NextAuth dengan konfigurasi server yang sama.
export async function getUserSession() {
  return await getServerSession(authConfig);
}
