import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { useCities, useZones, useDistricts } from '../hooks/useLocationApi';

interface LocationSelectorProps {
  onLocationChange: (location: {
    cityId: string | null;
    zoneId: string | null;
    districtId: string | null;
  }) => void;
  initialValues?: {
    cityId?: string;
    zoneId?: string;
    districtId?: string;
  };
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
  initialValues = {}
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(initialValues.cityId || null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(initialValues.zoneId || null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(initialValues.districtId || null);

  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const { zones, loading: zonesLoading, error: zonesError } = useZones(selectedCityId);
  const { districts, loading: districtsLoading, error: districtsError } = useDistricts(selectedCityId, selectedZoneId);

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    if (!selectedCityId) {
      setSelectedZoneId(null);
      setSelectedDistrictId(null);
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (!selectedZoneId) {
      setSelectedDistrictId(null);
    }
  }, [selectedZoneId]);

  // Notify parent component of location changes
  useEffect(() => {
    onLocationChange({
      cityId: selectedCityId,
      zoneId: selectedZoneId,
      districtId: selectedDistrictId,
    });
  }, [selectedCityId, selectedZoneId, selectedDistrictId, onLocationChange]);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedZoneId(null);
    setSelectedDistrictId(null);
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setSelectedDistrictId(null);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  return (
    <div className="space-y-4">
      {/* City Selection */}
      <div>
        <Label htmlFor="city">City *</Label>
        <Select 
          value={selectedCityId || ""} 
          onValueChange={handleCityChange}
          disabled={citiesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={citiesLoading ? "Loading cities..." : "Select a city"} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {citiesError && (
          <p className="text-sm text-destructive mt-1">{citiesError}</p>
        )}
      </div>

      {/* Zone Selection */}
      <div>
        <Label htmlFor="zone">Zone *</Label>
        <Select 
          value={selectedZoneId || ""} 
          onValueChange={handleZoneChange}
          disabled={!selectedCityId || zonesLoading}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedCityId 
                  ? "Select a city first" 
                  : zonesLoading 
                    ? "Loading zones..." 
                    : "Select a zone"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {zones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {zonesError && (
          <p className="text-sm text-destructive mt-1">{zonesError}</p>
        )}
      </div>

      {/* District Selection */}
      <div>
        <Label htmlFor="district">District *</Label>
        <Select 
          value={selectedDistrictId || ""} 
          onValueChange={handleDistrictChange}
          disabled={!selectedZoneId || districtsLoading}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedZoneId 
                  ? "Select a zone first" 
                  : districtsLoading 
                    ? "Loading districts..." 
                    : "Select a district"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {districtsError && (
          <p className="text-sm text-destructive mt-1">{districtsError}</p>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;