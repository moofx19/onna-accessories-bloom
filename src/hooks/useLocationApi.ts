import { useState, useEffect } from 'react';
import { locationApiService, City, Zone, District } from '../services/locationApi';

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await locationApiService.cities.getAll();
        setCities(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch cities');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};

export const useZones = (cityId: string | null) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) {
      setZones([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchZones = async () => {
      try {
        setLoading(true);
        const data = await locationApiService.zones.getByCityId(cityId);
        setZones(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching zones:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch zones');
        setZones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [cityId]);

  return { zones, loading, error };
};

export const useDistricts = (cityId: string | null, zoneId: string | null) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId || !zoneId) {
      setDistricts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await locationApiService.districts.getByCityAndZoneId(cityId, zoneId);
        setDistricts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching districts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch districts');
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [cityId, zoneId]);

  return { districts, loading, error };
};