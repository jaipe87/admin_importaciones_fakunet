
export interface Entity {
  id: string;
  name: string;
  active: boolean;
}

export interface Brand extends Entity {}

export interface Category extends Entity {}

export interface Slide {
  id: string;
  image_url: string;
  active: boolean;
}

export interface Product {
  code: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  features: string[] | string;
  stock: string;
  whatsapp_message: string;
  image_url: string;
  active: boolean;
  pdf_url: string;
}

export interface Message {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  content: string;
  date: string;
  read: boolean;
}

export interface AnalyticsConfig {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
}

// Analytics Types
export type AnalyticsSummary = {
  summary: {
    sessionsLast7Days: number;
    whatsappClicksLast7Days: number;
    conversionRateLast7Days: number; // 0.0 - 1.0
  };
  whatsappByDay: {
    date: string;         
    whatsappClicks: number;
  }[];
  topConsultedProducts: {
    productName: string;
    productCode?: string;
    consultsLast7Days: number;
  }[];
  topViewedProducts?: {
    productName: string;
    productCode?: string;
    viewsLast7Days: number;
  }[];
};
