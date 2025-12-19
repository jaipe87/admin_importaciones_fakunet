
import { useState, useEffect } from 'react';
import { AnalyticsSummary } from '@/types';

type UseAnalyticsSummaryResult = {
  data: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
};

export function useAnalyticsSummary(): UseAnalyticsSummaryResult {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/summary');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('No se pudieron cargar los datos de analítica.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
