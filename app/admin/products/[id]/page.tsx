
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, ToggleLeft, ToggleRight, FileText, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Product, Brand, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

// --- SUB-COMPONENTS ---

interface MediaUploaderProps {
  label: string;
  value: string;
  type: 'image' | 'pdf';
  onUpload: (file: File) => Promise<string>;
  onChange: (url: string) => void;
}

const MediaUploader = ({ label, value, type, onUpload, onChange }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const url = await onUpload(e.target.files[0]);
      onChange(url);
    } catch (error) {
      alert('Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${type === 'image' ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div className="flex gap-2 items-center mb-3">
        <div className="flex-1 relative">
           <Input 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder={type === 'image' ? "/uploads/imagen.jpg" : "/uploads/ficha.pdf"}
              className="bg-white"
           />
        </div>
        <input 
          type="file" 
          ref={inputRef} 
          accept={type === 'image' ? "image/jpeg, image/png, image/webp" : "application/pdf"} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        <Button 
          type="button" 
          onClick={() => inputRef.current?.click()} 
          isLoading={uploading} 
          variant="secondary" 
          icon={<Upload size={16}/>}
        >
           Subir
        </Button>
      </div>

      {/* Preview Area */}
      {value && type === 'image' && (
        <div className="w-full h-40 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-full object-contain" />
        </div>
      )}
      
      {value && type === 'pdf' && (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-fakunet-cta hover:underline font-medium bg-white px-3 py-2 rounded border border-blue-100 shadow-sm">
            <FileText size={16} /> 
            Ver PDF actual
        </a>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Product>({
    code: '',
    name: '',
    brand: '',
    category: '',
    description: '',
    features: '',
    stock: '',
    whatsapp_message: '',
    image_url: '',
    active: true,
    pdf_url: ''
  });
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
        try {
            const [brandRes, catRes] = await Promise.all([
                fetch('/api/brands').then(r => r.json()),
                fetch('/api/categories').then(r => r.json())
            ]);
            setBrands(brandRes);
            setCategories(catRes);

            if (!isNew) {
                const prodRes = await fetch(`/api/products/${id}`);
                if (!prodRes.ok) throw new Error('Producto no encontrado');
                const prodData = await prodRes.json();
                
                // Format features for textarea
                const featuresStr = Array.isArray(prodData.features) 
                    ? prodData.features.join('\n') 
                    : prodData.features;

                setFormData({ ...prodData, features: featuresStr });
            }
        } catch (error) {
            console.error(error);
            if (!isNew) router.push('/admin/products');
        } finally {
            setLoading(false);
        }
    };
    init();
  }, [id, isNew, router]);

  // Handlers
  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/media/upload', { method: 'POST', body: form });
    if(!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew ? '/api/products' : `/api/products/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Loading State
  if (loading) {
    return (
        <div className="flex h-64 items-center justify-center text-fakunet-main">
            <Loader2 className="animate-spin mr-2" /> Cargando datos...
        </div>
    );
  }

  // Options
  const brandOptions = [{value: '', label: '-- Seleccionar Marca --'}, ...brands.map(b => ({ value: b.name, label: b.name }))];
  const categoryOptions = [{value: '', label: '-- Seleccionar Categoría --'}, ...categories.map(c => ({ value: c.name, label: c.name }))];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ArrowLeft className="text-gray-600" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-fakunet-main">
                    {isNew ? 'Crear Nuevo Producto' : 'Editar Producto'}
                </h1>
                {!isNew && <p className="text-sm text-gray-500">Editando: {formData.name}</p>}
            </div>
        </div>
        
        {!isNew && (
            <button 
                type="button"
                onClick={() => setFormData({...formData, active: !formData.active})}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.active 
                    ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
            >
                {formData.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                <span className="font-semibold text-sm">{formData.active ? 'Activo' : 'Inactivo'}</span>
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-8">
            {/* Section: Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Código (Único)" 
                    name="code" 
                    value={formData.code} 
                    onChange={handleInput} 
                    required 
                    disabled={!isNew}
                    placeholder="Ej: CAM-001"
                />
                <Input 
                    label="Stock Disponible" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInput} 
                    placeholder="Ej: 10 unidades"
                />
                <div className="md:col-span-2">
                    <Input 
                        label="Nombre del Producto" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInput} 
                        required 
                    />
                </div>
                <Select 
                    label="Marca" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleInput} 
                    options={brandOptions} 
                    required 
                />
                <Select 
                    label="Categoría" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInput} 
                    options={categoryOptions} 
                    required 
                />
            </section>

            <hr className="border-gray-100" />

            {/* Section: Media */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader 
                    label="Imagen Principal del Producto"
                    value={formData.image_url}
                    type="image"
                    onUpload={uploadFile}
                    onChange={(url) => setFormData({...formData, image_url: url})}
                />
                <MediaUploader 
                    label="Ficha Técnica (PDF)"
                    value={formData.pdf_url}
                    type="pdf"
                    onUpload={uploadFile}
                    onChange={(url) => setFormData({...formData, pdf_url: url})}
                />
            </section>

            <hr className="border-gray-100" />

            {/* Section: Details */}
            <section className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fakunet-cta outline-none text-sm"
                        placeholder="Breve descripción del producto..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Características (Una por línea)</label>
                    <textarea
                        name="features"
                        rows={6}
                        value={formData.features as string}
                        onChange={handleInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fakunet-cta outline-none font-mono text-sm bg-gray-50"
                        placeholder="- Resolución 4K&#10;- Visión Nocturna&#10;- Audio Bidireccional"
                    />
                </div>
            </section>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col-reverse md:flex-row justify-end gap-3">
            <Link href="/admin/products" className="w-full md:w-auto">
                <Button type="button" variant="secondary" className="w-full md:w-auto">Cancelar</Button>
            </Link>
            <Button type="submit" isLoading={saving} icon={<Save size={20} />} className="w-full md:w-auto px-8">
                {isNew ? 'Crear Producto' : 'Guardar Cambios'}
            </Button>
        </div>

      </form>
    </div>
  );
}
