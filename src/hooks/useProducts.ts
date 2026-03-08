import { useQuery } from '@tanstack/react-query';
import { fetchBrands, fetchLocations, fetchModels } from '../services/productService';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });
}
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });
}

export function useModels(brand: string, q?: string) {
  return useQuery({
    queryKey: ['models', brand, q],
    queryFn: () => fetchModels(brand, q),
    enabled: !!brand,
  });
}