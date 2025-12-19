
'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Brand } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [createName, setCreateName] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const res = await fetch('/api/brands');
    if (res.ok) setBrands(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    
    await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName })
    });
    setCreateName('');
    fetchBrands();
  };

  const handleUpdate = async (id: string, updates: Partial<Brand>) => {
    await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    setEditingId(null);
    fetchBrands();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta marca?')) return;
    await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    fetchBrands();
  };

  return (
    <div>
      <PageHeader title="Gestión de Marcas" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">Agregar Nueva Marca</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nombre de la marca"
            />
            <Button type="submit" icon={<Plus size={18} />}>Agregar</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-fakunet-bg text-gray-600 font-semibold text-sm uppercase">
                <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {brands.map(brand => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            {editingId === brand.id ? (
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="py-1"
                                    />
                                    <Button variant="ghost" onClick={() => handleUpdate(brand.id, { name: newName })} className="text-green-600">
                                        <Save size={18}/>
                                    </Button>
                                    <Button variant="ghost" onClick={() => setEditingId(null)} className="text-gray-500">
                                        <X size={18}/>
                                    </Button>
                                </div>
                            ) : (
                                <span className="font-medium text-gray-800">{brand.name}</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <button onClick={() => handleUpdate(brand.id, { active: !brand.active })} className="flex items-center gap-2 text-sm hover:opacity-80">
                                {brand.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
                                <span className={brand.active ? "text-green-700" : "text-gray-500"}>{brand.active ? 'Activo' : 'Inactivo'}</span>
                            </button>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => { setEditingId(brand.id); setNewName(brand.name); }} className="text-blue-500">
                                <Edit2 size={18} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(brand.id)} className="text-red-500">
                                <Trash2 size={18} />
                            </Button>
                        </td>
                    </tr>
                ))}
                {brands.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-6 text-gray-500">No hay marcas registradas.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
