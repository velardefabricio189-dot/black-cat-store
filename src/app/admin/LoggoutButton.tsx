"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 text-white hover:text-white transition-colors text-left w-full cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
}
