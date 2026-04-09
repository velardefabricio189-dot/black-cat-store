import Link from 'next/link'
import LogoutButton from '../admin/LoggoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar admin */}
      <aside className="w-48 bg-gray-900 text-white flex flex-col px-4 py-6 shrink-0">
        <span className="font-bold text-lg mb-8">Admin</span>
        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/admin/productos"
            className="text-sm px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Productos
          </Link>
          <Link href="/admin/categorias"
            className="text-sm px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Categorías
          </Link>
        </nav>
        <LogoutButton />
      </aside>

      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  )
}