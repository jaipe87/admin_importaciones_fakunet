
import { AnalyticsSummary } from '@/types';
import { analyticsConfigDB } from '@/lib/db';

/**
 * Servicio para gestionar la obtención de métricas.
 * Actualmente genera Mocks, pero está estructurado para integrar GA4.
 */
export class AnalyticsService {
  
  /**
   * Obtiene el resumen de métricas para el dashboard.
   */
  async getSummary(): Promise<AnalyticsSummary> {
    // 1. Intentar cargar configuración (Para uso futuro con GA4)
    const config = analyticsConfigDB.get();
    const hasCredentials = config.propertyId && config.clientEmail && config.privateKey;

    if (hasCredentials) {
       // TODO: Implementar llamada real a Google Analytics Data API
       // const realData = await fetchGA4Data(config);
       // return realData;
    }

    // 2. Si no hay credenciales o para desarrollo, devolver Mocks
    return this.generateMockData();
  }

  /**
   * Genera datos simulados para visualización.
   */
  private generateMockData(): AnalyticsSummary {
    const today = new Date();
    const days = 7;
    
    // Generar historial de 7 días
    const whatsappByDay = Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (days - 1 - i));
      const dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }); 
      return {
        date: dateStr, 
        whatsappClicks: Math.floor(Math.random() * 20) + 5 
      };
    });

    const totalClicks = whatsappByDay.reduce((sum, item) => sum + item.whatsappClicks, 0);
    const totalSessions = 1200 + Math.floor(Math.random() * 500); 

    return {
      summary: {
        sessionsLast7Days: totalSessions,
        whatsappClicksLast7Days: totalClicks,
        conversionRateLast7Days: totalClicks / totalSessions,
      },
      whatsappByDay,
      topConsultedProducts: [
        { productName: "Cámara IP Exterior WiFi", productCode: "CAM-001", consultsLast7Days: 42 },
        { productName: "Kit Alarma Vecinal", productCode: "ALM-202", consultsLast7Days: 35 },
        { productName: "Sensor de Movimiento", productCode: "SEN-305", consultsLast7Days: 28 },
        { productName: "DVR 8 Canales", productCode: "DVR-008", consultsLast7Days: 19 },
        { productName: "Video Portero", productCode: "VID-101", consultsLast7Days: 15 },
      ],
      topViewedProducts: [
        { productName: "Cámara IP Exterior WiFi", productCode: "CAM-001", viewsLast7Days: 350 },
        { productName: "Kit Alarma Vecinal", productCode: "ALM-202", viewsLast7Days: 290 },
        { productName: "Cable UTP Cat6", productCode: "CBL-100", viewsLast7Days: 180 },
        { productName: "Sensor de Movimiento", productCode: "SEN-305", viewsLast7Days: 150 },
        { productName: "Sirena 30W", productCode: "SIR-030", viewsLast7Days: 120 },
      ]
    };
  }
}

export const analyticsService = new AnalyticsService();
