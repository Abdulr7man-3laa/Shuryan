import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon (medical/clinic)
const clinicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks and place marker
function LocationMarker({ position, setPosition, disabled, isUserInteractionRef, lastPropsRef }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      
      // Mark as user interaction
      isUserInteractionRef.current = true;
      
      const newPos = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };
      
      setPosition(newPos);
      
      // Update lastPropsRef to prevent props override
      lastPropsRef.current = { lat: newPos.lat, lng: newPos.lng };
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={clinicIcon} />
  ) : null;
}

// Component to update map center when position changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], 13, {
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
}

const MapPicker = ({ 
  latitude = 30.0444, // Cairo default
  longitude = 31.2357, 
  onLocationChange,
  disabled = false,
  triggerAddressFetch = false // Flag to trigger address fetch from parent
}) => {
  const [position, setPosition] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const isUserInteractionRef = useRef(false); // Track if change is from user
  const lastPropsRef = useRef({ lat: latitude, lng: longitude }); // Track last props
  const isGPSActionRef = useRef(false); // Track if GPS action is in progress
  const gpsCoordinatesRef = useRef(null); // Store GPS coordinates

  // Update position when props change (from parent)
  useEffect(() => {
    if (latitude && longitude) {
      const newLat = parseFloat(latitude);
      const newLng = parseFloat(longitude);
      const lastLat = parseFloat(lastPropsRef.current.lat);
      const lastLng = parseFloat(lastPropsRef.current.lng);
      
      // Skip if GPS action is in progress
      if (isGPSActionRef.current) {
        console.log('🗺️ MapPicker: Skipping props update - GPS action in progress');
        return;
      }
      
      // Only update if props actually changed (not from our own update)
      const latChanged = Math.abs(newLat - lastLat) > 0.00001;
      const lngChanged = Math.abs(newLng - lastLng) > 0.00001;
      
      if (latChanged || lngChanged) {
        console.log('🗺️ MapPicker: Props changed, updating position', { 
          from: { lat: lastLat, lng: lastLng }, 
          to: { lat: newLat, lng: newLng } 
        });
        setPosition({ lat: newLat, lng: newLng });
        lastPropsRef.current = { lat: newLat, lng: newLng };
        
        // Store GPS coordinates when they first arrive
        if (!gpsCoordinatesRef.current) {
          gpsCoordinatesRef.current = { lat: newLat, lng: newLng };
          console.log('🗺️ MapPicker: Stored GPS coordinates', gpsCoordinatesRef.current);
        }
      }
    }
  }, [latitude, longitude]);
  
  // Handle triggerAddressFetch from parent (e.g., "موقعي" button)
  useEffect(() => {
    if (triggerAddressFetch && gpsCoordinatesRef.current) {
      console.log('🗺️ MapPicker: Parent triggered address fetch');
      console.log('🗺️ MapPicker: Using GPS coordinates', gpsCoordinatesRef.current);
      
      // Set GPS action flag
      isGPSActionRef.current = true;
      
      // Fetch address using stored GPS coordinates
      const { lat, lng } = gpsCoordinatesRef.current;
      getAddressFromCoordinates(lat, lng, true).finally(() => {
        // Clear GPS action flag after completion
        setTimeout(() => {
          isGPSActionRef.current = false;
          gpsCoordinatesRef.current = null; // Clear stored coordinates
          console.log('🗺️ MapPicker: GPS action completed');
        }, 500);
      });
    }
  }, [triggerAddressFetch]);

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng, isUserAction = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setAddress(data.display_name);
        
        // Extract address components
        const addressDetails = {
          governorate: data.address?.state || data.address?.province || '',
          city: data.address?.city || data.address?.town || data.address?.village || '',
          street: data.address?.road || data.address?.street || '',
          fullAddress: data.display_name
        };
        
        console.log('🗺️ MapPicker: Address details extracted:', addressDetails);
        console.log('🗺️ MapPicker: isUserAction:', isUserAction);
        
        // Return address details to parent if user action
        if (onLocationChange && isUserAction) {
          console.log('🗺️ MapPicker: Calling onLocationChange with addressDetails');
          onLocationChange(lat, lng, addressDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle position change
  useEffect(() => {
    if (position) {
      const isUserAction = isUserInteractionRef.current;
      console.log('🗺️ MapPicker: Position changed, fetching address...', { isUserAction });
      getAddressFromCoordinates(position.lat, position.lng, isUserAction);
      
      // Reset flag after handling
      if (isUserAction) {
        setTimeout(() => {
          isUserInteractionRef.current = false;
        }, 100);
      }
    }
  }, [position]);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 shadow-lg">
        <MapContainer
          center={position ? [position.lat, position.lng] : [30.0444, 31.2357]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          ref={mapRef}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
          zoomControl={!disabled}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Update map center when position changes */}
          <MapUpdater center={position} />
          
          {!disabled && (
            <LocationMarker 
              position={position} 
              setPosition={setPosition} 
              isUserInteractionRef={isUserInteractionRef}
              lastPropsRef={lastPropsRef}
            />
          )}
          
          {disabled && position && (
            <Marker position={[position.lat, position.lng]} icon={clinicIcon} />
          )}
        </MapContainer>

        {disabled && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] pointer-events-none"></div>
        )}
      </div>

      {/* Address Display */}
      {/* {address && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">العنوان:</span> {address}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default MapPicker;
