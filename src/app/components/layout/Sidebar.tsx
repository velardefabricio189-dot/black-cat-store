import Link from 'next/link'
import type { Category } from '../../../types/index'

export default function Sidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-black border-r px-4 py-6 shrink-0">
      <Link href="/" className="text-xl font-bold mb-8 block">
        LOGO
      </Link>

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Categorías
      </p>

      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}