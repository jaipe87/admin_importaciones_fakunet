
import Link from 'next/link';
import { Package, Image as ImageIcon, ArrowRight, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-fakunet-main">Panel de Gestión</h1>
      <p className="text-gray-600">Bienvenido al sistema administrativo de Importaciones Fakunet.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Products Card */}
        <Link href="/admin/products" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-fakunet-cta mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gestionar Productos</h3>
              <p className="text-gray-500 text-sm">
                Administra el inventario, actualiza precios, edita descripciones y características.
              </p>
            </div>
            <div className="mt-6 flex items-center text-fakunet-cta font-medium group-hover:gap-2 transition-all">
              <span>Ir a productos</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>

        {/* Media Card */}
        <Link href="/admin/media" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gestionar Imágenes</h3>
              <p className="text-gray-500 text-sm">
                Sube logos, banners y fotos de productos. Copia URLs directamente.
              </p>
            </div>
            <div className="mt-6 flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
              <span>Ir a galería</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>

        {/* Analytics Card */}
        <Link href="/admin/analytics" className="group">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analítica Web</h3>
              <p className="text-gray-500 text-sm">
                Visualiza KPIs de tráfico, clics en WhatsApp y productos más consultados.
              </p>
            </div>
            <div className="mt-6 flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
              <span>Ver KPIs</span>
              <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
