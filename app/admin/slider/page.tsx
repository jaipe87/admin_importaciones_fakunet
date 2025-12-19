'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Slide } from '@/types';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

export default function SliderPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const res = await fetch('/api/slider');
    if (res.ok) {
        setSlides(await res.json());
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    
    try {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        // 1. Upload to media
        const uploadRes = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!uploadRes.ok) throw new Error('Error subiendo imagen');
        const uploadData = await uploadRes.json();

        // 2. Create slide
        await fetch('/api/slider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: uploadData.url })
        });
        
        fetchSlides();
        if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
        alert('Error al subir slide');
    } finally {
        setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('¿Eliminar del slider?')) return;
    await fetch('/api/slider', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    fetchSlides();
  };

  return (
    <div>
      <PageHeader title="Slider Home">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*"
        />
        <Button 
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploading}
            icon={<Plus size={20} />}
        >
            Agregar Slide
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map(slide => (
            <div key={slide.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.image_url} alt="slide" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="danger"
                        onClick={() => handleDelete(slide.id)}
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-sm"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
                <div className="p-3 bg-white border-t border-gray-100 text-xs text-gray-500 truncate font-mono">
                    {slide.image_url}
                </div>
            </div>
        ))}
        {slides.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No hay imágenes en el slider.
            </div>
        )}
      </div>
    </div>
  );
}