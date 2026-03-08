import { apiCall } from './apiService';

export const fetchBrands = () => apiCall('GET', '/api/meta/brands', {});

export const fetchLocations = () => apiCall('GET', '/api/meta/locations', {});

export const fetchModels = (brand: string, q?: string) => apiCall('GET', '/api/meta/models', { brand, ...(q ? { q } : {}) });