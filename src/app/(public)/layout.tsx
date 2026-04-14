import { getCategories } from "../lib/supabase/queries";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import HeaderTitle from "../components/layout/HeaderTitle";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen">
      <Sidebar categories={categories} />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-black/90 font-sans">
          <HeaderTitle categories={categories} />
          <MobileNav categories={categories} />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
