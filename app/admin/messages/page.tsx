
'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Mail, Phone, User, Calendar } from 'lucide-react';
import { Message } from '@/types';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) setMessages(await res.json());
    } catch (error) {
      console.error('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal open
    if (!confirm('¿Eliminar este mensaje permanentemente?')) return;
    
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    fetchMessages();
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleView = async (msg: Message) => {
    setSelectedMessage(msg);
    // Mark as read if not already
    if (!msg.read) {
        await fetch(`/api/messages/${msg.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true })
        });
        // Update local state to reflect read status without refetching all
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <PageHeader title="Mensajes y Consultas">
        <div className="bg-blue-50 text-fakunet-cta px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
           {messages.filter(m => !m.read).length} No leídos
        </div>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-fakunet-bg text-gray-600 font-semibold text-sm uppercase">
                    <tr>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Remitente</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Asunto / Mensaje</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                         <tr><td colSpan={6} className="text-center py-8 text-gray-500">Cargando mensajes...</td></tr>
                    ) : messages.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay mensajes recibidos.</td></tr>
                    ) : (
                        messages.map(msg => (
                            <tr 
                                key={msg.id} 
                                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${!msg.read ? 'bg-blue-50/30' : ''}`}
                                onClick={() => handleView(msg)}
                            >
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {formatDate(msg.date)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`font-medium ${!msg.read ? 'text-fakunet-main font-bold' : 'text-gray-800'}`}>
                                        {msg.firstName} {msg.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {msg.phone || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {msg.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {msg.content}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            onClick={(e) => { e.stopPropagation(); handleView(msg); }}
                                            className="text-blue-500"
                                            title="Ver detalles"
                                        >
                                            <Eye size={18} />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={(e) => handleDelete(msg.id, e)}
                                            className="text-red-500"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Detalles de la Consulta"
      >
        {selectedMessage && (
            <div className="space-y-6">
                
                {/* Header Info */}
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-fakunet-cta">
                        <User size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-800">{selectedMessage.firstName} {selectedMessage.lastName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={14} />
                            <span>{formatDate(selectedMessage.date)}</span>
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase mb-1">
                            <Mail size={14} /> Correo Electrónico
                        </div>
                        <div className="text-gray-800 break-all">{selectedMessage.email}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase mb-1">
                            <Phone size={14} /> Celular / Teléfono
                        </div>
                        <div className="text-gray-800">{selectedMessage.phone || 'No especificado'}</div>
                    </div>
                </div>

                {/* Message Content */}
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Mensaje</label>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg text-gray-700 min-h-[100px] whitespace-pre-wrap">
                        {selectedMessage.content}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={() => setSelectedMessage(null)}>
                        Cerrar
                    </Button>
                </div>
            </div>
        )}
      </Modal>

    </div>
  );
}
