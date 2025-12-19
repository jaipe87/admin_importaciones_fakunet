
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit, Tag, Plus } from 'lucide-react';
import { Product, Category } from '@/types';
import { Input, Select } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  useEffect(() => {
    Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/categories').then(res => res.json())
    ]).then(([prodData, catData]) => {
        setProducts(prodData);
        setCategories(catData);
        setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: 'Todos', label: 'Todas las categorías' },
    ...categories.map(c => ({ value: c.name, label: c.name }))
  ];

  return (
    <div>
      <PageHeader title="Inventario de Productos">
        <Link href="/admin/products/new">
            <Button icon={<Plus size={20} />}>Nuevo Producto</Button>
        </Link>
      </PageHeader>

      <div className="flex items-center justify-between mb-4">
        <div className="bg-blue-50 text-fakunet-cta px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
          Total: {filteredProducts.length} productos
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
           <Input 
                placeholder="Buscar por nombre o código..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="w-full md:w-64">
           <Select 
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
           />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-fakunet-bg text-gray-600 font-semibold text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Marca</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Cargando productos...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No se encontraron productos.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.code} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">#{product.code}</td>
                    <td className="px-6 py-4">
                      {product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={product.image_url} alt="img" className="w-10 h-10 object-cover rounded bg-gray-100 border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-200">
                          <Tag size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-fakunet-main border border-blue-100 text-xs px-2.5 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                            product.active 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                            {product.active ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/products/${product.code}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-fakunet-cta text-white hover:bg-fakunet-hover transition-colors shadow-sm"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
