
'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, MessageCircle, TrendingUp, AlertCircle, MousePointerClick, 
  Settings, Save, Eye 
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAnalyticsSummary } from './useAnalyticsSummary';
import { AnalyticsSummary } from '@/types';

// --- SUB-COMPONENTS (Local for cohesion) ---

const KpiCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${bgClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 text-xs text-gray-400">{subtext}</div>
  </div>
);

const EvolutionChart = ({ data }: { data: AnalyticsSummary['whatsappByDay'] }) => (
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-2 mb-6">
      <MousePointerClick size={20} className="text-fakunet-cta" />
      <h3 className="text-lg font-bold text-gray-800">Evolución Clics WhatsApp</h3>
    </div>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#007BFF" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="whatsappClicks" 
            stroke="#007BFF" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClick)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TopProductsTable = ({ products }: { products: AnalyticsSummary['topConsultedProducts'] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
    <div className="flex items-center gap-2 mb-4">
      <Eye size={20} className="text-gray-600" />
      <h3 className="text-lg font-bold text-gray-800">Más Consultados</h3>
    </div>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-400 uppercase font-light border-b border-gray-100">
          <tr>
            <th className="text-left py-2 font-medium">Producto</th>
            <th className="text-right py-2 font-medium">Clics</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((prod, idx) => (
            <tr key={idx} className="group">
              <td className="py-3 pr-2">
                <div className="font-medium text-gray-800 group-hover:text-fakunet-cta transition-colors truncate max-w-[150px]" title={prod.productName}>
                  {prod.productName}
                </div>
                {prod.productCode && (
                  <div className="text-xs text-gray-400">#{prod.productCode}</div>
                )}
              </td>
              <td className="py-3 text-right font-bold text-gray-700">
                {prod.consultsLast7Days}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function AnalyticsPage() {
  const { data, loading, error } = useAnalyticsSummary();
  const [configOpen, setConfigOpen] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [configForm, setConfigForm] = useState({ propertyId: '', clientEmail: '', privateKey: '' });

  // Load config only when modal opens
  useEffect(() => {
    if (configOpen) {
      fetch('/api/analytics/config')
        .then(res => res.json())
        .then(data => {
            setConfigForm({
                propertyId: data.propertyId || '',
                clientEmail: data.clientEmail || '',
                privateKey: '' 
            });
        });
    }
  }, [configOpen]);

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigLoading(true);
    try {
        await fetch('/api/analytics/config', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(configForm)
        });
        setConfigOpen(false);
        window.location.reload();
    } catch (err) {
        alert('Error guardando configuración');
    } finally {
        setConfigLoading(false);
    }
  };

  // State: Loading
  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fakunet-cta"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // State: Error
  if (error || !data) {
      return (
        <div className="space-y-6">
            <PageHeader title="Analítica Web" />
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4 text-red-700">
                <AlertCircle size={32} />
                <div>
                    <h3 className="font-bold">Error de Carga</h3>
                    <p>{error || 'No se pudieron obtener los datos.'}</p>
                </div>
            </div>
        </div>
      );
  }

  // State: Success
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Analítica (Últimos 7 días)">
        <Button variant="secondary" onClick={() => setConfigOpen(true)} icon={<Settings size={18} />}>
          Configurar GA4
        </Button>
      </PageHeader>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard 
          title="Sesiones" 
          value={data.summary.sessionsLast7Days.toLocaleString()} 
          subtext="Visitas totales a la web"
          icon={Activity}
          colorClass="text-fakunet-main"
          bgClass="bg-blue-50 text-blue-600"
        />
        <KpiCard 
          title="Clics WhatsApp" 
          value={data.summary.whatsappClicksLast7Days.toLocaleString()} 
          subtext="Intención de compra"
          icon={MessageCircle}
          colorClass="text-fakunet-main"
          bgClass="bg-green-50 text-green-600"
        />
        <KpiCard 
          title="Tasa Conversión" 
          value={`${(data.summary.conversionRateLast7Days * 100).toFixed(1)}%`} 
          subtext="Visitas que hacen clic"
          icon={TrendingUp}
          colorClass="text-fakunet-cta"
          bgClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EvolutionChart data={data.whatsappByDay} />
        <TopProductsTable products={data.topConsultedProducts} />
      </div>

      {/* Configuration Modal */}
      <Modal isOpen={configOpen} onClose={() => setConfigOpen(false)} title="Configuración Google Analytics 4">
        <form onSubmit={handleConfigSave} className="space-y-4">
            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
                Ingresa los datos de tu <b>Service Account</b> para conectar GA4 Data API.
            </div>
            <Input 
                label="GA4 Property ID"
                placeholder="ej: 345678901"
                value={configForm.propertyId}
                onChange={(e) => setConfigForm({...configForm, propertyId: e.target.value})}
            />
            <Input 
                label="Client Email (Service Account)"
                value={configForm.clientEmail}
                onChange={(e) => setConfigForm({...configForm, clientEmail: e.target.value})}
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Private Key</label>
                <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fakunet-cta outline-none text-xs font-mono"
                    rows={3}
                    placeholder="-----BEGIN PRIVATE KEY-----..."
                    value={configForm.privateKey}
                    onChange={(e) => setConfigForm({...configForm, privateKey: e.target.value})}
                />
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={configLoading} icon={<Save size={18}/>}>
                    Guardar
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
}
