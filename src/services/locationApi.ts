const BASE_URL = 'https://backend.onnaaccs.com/api';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function for GET requests
const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse<T>(response);
};

export interface City {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  name: string;
  cityId: string;
}

export interface District {
  id: string;
  name: string;
  cityId: string;
  zoneId: string;
}

export const locationApiService = {
  cities: {
    getAll: (): Promise<City[]> => get<City[]>('/cities'),
    getById: (cityId: string): Promise<City> => get<City>(`/cities/${cityId}`),
  },
  
  zones: {
    getByCityId: (cityId: string): Promise<Zone[]> => get<Zone[]>(`/cities/${cityId}/zones`),
  },
  
  districts: {
    getByCityAndZoneId: (cityId: string, zoneId: string): Promise<District[]> => 
      get<District[]>(`/cities/${cityId}/${zoneId}/districts`),
  },
};