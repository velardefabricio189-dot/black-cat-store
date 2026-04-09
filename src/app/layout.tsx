import type { Metadata } from 'next'
import { getCategories } from '../app/lib/supabase/queries'
import Sidebar from '../app/components/layout/Sidebar'
import MobileNav from '../app/components/layout/MobileNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mi Catálogo',
  description: 'Catálogo de productos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar desktop */}
          <Sidebar categories={categories} />

          {/* main content */}
          <div className="flex-1 flex flex-col">
            {/*header para moviles */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
              <span className="font-semibold text-lg">Mi Catálogo</span>
              <MobileNav categories={categories} />
            </header>

            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}