"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  radius: number;
  address: string;
}

interface LocationPickerProps {
  onLocationSet: (location: LocationData) => void;
  initialLocation?: LocationData;
}

export function LocationPicker({
  onLocationSet,
  initialLocation,
}: LocationPickerProps) {
  const [location, setLocation] = useState<LocationData>({
    latitude: initialLocation?.latitude || 0,
    longitude: initialLocation?.longitude || 0,
    radius: initialLocation?.radius || 100,
    address: initialLocation?.address || "",
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationSet, setLocationSet] = useState(!!initialLocation);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        const newLocation = {
          ...location,
          latitude,
          longitude,
          address: location.address || address,
        };

        setLocation(newLocation);
        setLocationSet(true);
        onLocationSet(newLocation);
        setIsGettingLocation(false);

        toast({
          title: "Location Captured",
          description: "Current location has been set for the quiz.",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Could not get your current location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleInputChange = (
    field: keyof LocationData,
    value: string | number
  ) => {
    const newLocation = { ...location, [field]: value };
    setLocation(newLocation);

    if (newLocation.latitude !== 0 && newLocation.longitude !== 0) {
      setLocationSet(true);
      onLocationSet(newLocation);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Quiz Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={location.latitude}
              onChange={(e) =>
                handleInputChange(
                  "latitude",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              placeholder="e.g., 24.8607"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={location.longitude}
              onChange={(e) =>
                handleInputChange(
                  "longitude",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              placeholder="e.g., 67.0011"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="radius">Allowed Radius (meters)</Label>
          <Input
            id="radius"
            type="number"
            value={location.radius}
            onChange={(e) =>
              handleInputChange(
                "radius",
                Number.parseInt(e.target.value) || 100
              )
            }
            placeholder="e.g., 100"
            min="10"
            max="1000"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Students must be within this distance to join the quiz (10-1000
            meters)
          </p>
        </div>

        <div>
          <Label htmlFor="address">Location Description</Label>
          <Input
            id="address"
            value={location.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="e.g., Main Campus Library, Room 101"
          />
        </div>

        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
          variant="outline"
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </>
          )}
        </Button>

        {locationSet && location.latitude !== 0 && location.longitude !== 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Location Set Successfully!</span>
            </div>
            <div className="text-sm text-green-600 space-y-1">
              <p>
                <strong>Location:</strong> {location.address}
              </p>
              <p>
                <strong>Coordinates:</strong> {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
              <p>
                <strong>Allowed Radius:</strong> {location.radius} meters
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
