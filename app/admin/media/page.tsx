'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Copy, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  date: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/media/upload'); 
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchFiles();
      } else {
        alert('Error al subir imagen');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      if (res.ok) {
        setFiles(files.filter(f => f.name !== filename));
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <PageHeader title="Galería Multimedia">
        <form onSubmit={handleUpload} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, application/pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-fakunet-cta
              hover:file:bg-blue-100 cursor-pointer"
            required
          />
          <Button type="submit" isLoading={uploading} icon={<Upload size={18} />}>
            Subir
          </Button>
        </form>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">Cargando imágenes...</div>
        ) : files.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No hay imágenes subidas aún.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {files.map((file) => (
              <div key={file.name} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow bg-gray-50 group">
                <div className="aspect-square bg-white border border-gray-100 rounded-md overflow-hidden relative mb-3 flex items-center justify-center">
                  {file.name.endsWith('.pdf') ? (
                      <div className="text-red-500 flex flex-col items-center">
                          <span className="text-xs font-bold border border-red-200 bg-red-50 px-2 py-1 rounded">PDF</span>
                      </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium text-sm text-gray-800 truncate" title={file.name}>{file.name}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatSize(file.size)}</span>
                    <span>{new Date(file.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded hover:bg-gray-50 text-xs transition-colors"
                    >
                      {copied === file.url ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      {copied === file.url ? 'Copiado' : 'Copiar URL'}
                    </button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(file.name)}
                      className="px-3 h-auto py-1.5"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}