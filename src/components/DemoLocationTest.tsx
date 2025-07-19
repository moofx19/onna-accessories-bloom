import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const DemoLocationTest: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    cityId: string | null;
    zoneId: string | null;
    districtId: string | null;
  }>({
    cityId: null,
    zoneId: null,
    districtId: null,
  });

  const handleLocationChange = (location: {
    cityId: string | null;
    zoneId: string | null;
    districtId: string | null;
  }) => {
    setSelectedLocation(location);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Dynamic Location Selector Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LocationSelector 
            onLocationChange={handleLocationChange}
            initialValues={selectedLocation}
          />
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Selected Location:</h3>
            <p><strong>City ID:</strong> {selectedLocation.cityId || 'Not selected'}</p>
            <p><strong>Zone ID:</strong> {selectedLocation.zoneId || 'Not selected'}</p>
            <p><strong>District ID:</strong> {selectedLocation.districtId || 'Not selected'}</p>
          </div>
          
          <Button 
            disabled={!selectedLocation.cityId || !selectedLocation.zoneId || !selectedLocation.districtId}
            className="w-full"
          >
            {selectedLocation.cityId && selectedLocation.zoneId && selectedLocation.districtId 
              ? 'Location Selected - Ready to Proceed' 
              : 'Please Select All Location Fields'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoLocationTest;