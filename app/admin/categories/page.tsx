'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [createName, setCreateName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) {
        const data = await res.json();
        setCategories(data);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    
    await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName })
    });
    setCreateName('');
    fetchCategories();
  };

  const handleUpdate = async (id: string, updates: Partial<Category>) => {
    await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    setEditingId(null);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div>
      <PageHeader title="Gestión de Categorías" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">Agregar Nueva Categoría</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nombre de la categoría"
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
                {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            {editingId === cat.id ? (
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="py-1"
                                    />
                                    <Button variant="ghost" onClick={() => handleUpdate(cat.id, { name: newName })} className="text-green-600">
                                        <Save size={18}/>
                                    </Button>
                                    <Button variant="ghost" onClick={() => setEditingId(null)} className="text-gray-500">
                                        <X size={18}/>
                                    </Button>
                                </div>
                            ) : (
                                <span className="font-medium text-gray-800">{cat.name}</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <button onClick={() => handleUpdate(cat.id, { active: !cat.active })} className="flex items-center gap-2 text-sm hover:opacity-80">
                                {cat.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
                                <span className={cat.active ? "text-green-700" : "text-gray-500"}>{cat.active ? 'Activo' : 'Inactivo'}</span>
                            </button>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => { setEditingId(cat.id); setNewName(cat.name); }} className="text-blue-500">
                                <Edit2 size={18} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(cat.id)} className="text-red-500">
                                <Trash2 size={18} />
                            </Button>
                        </td>
                    </tr>
                ))}
                {categories.length === 0 && !loading && (
                    <tr><td colSpan={3} className="text-center py-6 text-gray-500">No hay categorías registradas.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}