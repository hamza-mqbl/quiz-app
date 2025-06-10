"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationCheckerProps {
  quizLocation: {
    latitude: number;
    longitude: number;
    radius: number;
    address?: string;
  };
  onLocationVerified: (
    verified: boolean,
    studentLocation?: { latitude: number; longitude: number }
  ) => void;
  isRequired?: boolean;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function LocationChecker({
  quizLocation,
  onLocationVerified,
  isRequired = true,
}: LocationCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "pending" | "checking" | "verified" | "failed"
  >("pending");
  const [distance, setDistance] = useState<number | null>(null);
  const [studentLocation, setStudentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const checkLocation = async () => {
    setIsChecking(true);
    setLocationStatus("checking");
    setErrorMessage("");

    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by this browser";
      setErrorMessage(error);
      setLocationStatus("failed");
      setIsChecking(false);
      onLocationVerified(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStudentLocation({ latitude, longitude });

        const distanceToQuiz = calculateDistance(
          latitude,
          longitude,
          quizLocation.latitude,
          quizLocation.longitude
        );
        setDistance(distanceToQuiz);

        const isWithinRange = distanceToQuiz <= quizLocation.radius;

        if (isWithinRange) {
          setLocationStatus("verified");
          toast({
            title: "Location Verified ✅",
            description: `You are ${Math.round(
              distanceToQuiz
            )}m from the quiz location.`,
          });
          onLocationVerified(true, { latitude, longitude });
        } else {
          setLocationStatus("failed");
          setErrorMessage(
            `You are ${Math.round(
              distanceToQuiz
            )}m away from the quiz location. You must be within ${
              quizLocation.radius
            }m to join this quiz.`
          );
          toast({
            title: "Location Verification Failed",
            description: `You are too far from the quiz location (${Math.round(
              distanceToQuiz
            )}m away).`,
            variant: "destructive",
          });
          onLocationVerified(false, { latitude, longitude });
        }
        setIsChecking(false);
      },
      (error) => {
        console.error("Location error:", error);
        let errorMsg = "Could not verify your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg =
              "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out. Please try again.";
            break;
        }

        setErrorMessage(errorMsg);
        setLocationStatus("failed");
        setIsChecking(false);
        toast({
          title: "Location Error",
          description: errorMsg,
          variant: "destructive",
        });
        onLocationVerified(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const getStatusIcon = () => {
    switch (locationStatus) {
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (locationStatus) {
      case "checking":
        return "Checking your location...";
      case "verified":
        return `Location verified! You are ${
          distance ? Math.round(distance) : 0
        }m from the quiz location.`;
      case "failed":
        return errorMessage || "Location verification failed.";
      default:
        return "Click to verify your location before joining the quiz.";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Location Verification {isRequired ? "Required" : "Optional"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            <strong>Quiz Location:</strong>{" "}
            {quizLocation.address || "Custom Location"}
            <br />
            <span className="text-sm text-muted-foreground">
              Required radius: {quizLocation.radius}m
            </span>
          </AlertDescription>
        </Alert>

        <p className="text-sm">{getStatusMessage()}</p>

        {studentLocation && (
          <div className="p-2 bg-blue-50 rounded-md text-xs">
            <p>
              <strong>Your location:</strong>{" "}
              {studentLocation.latitude.toFixed(6)},{" "}
              {studentLocation.longitude.toFixed(6)}
            </p>
            {distance && (
              <p>
                <strong>Distance to quiz:</strong> {Math.round(distance)}m
              </p>
            )}
          </div>
        )}

        {locationStatus === "failed" && errorMessage && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {locationStatus !== "verified" && (
          <Button
            onClick={checkLocation}
            disabled={isChecking}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                {locationStatus === "failed"
                  ? "Try Again"
                  : "Verify My Location"}
              </>
            )}
          </Button>
        )}

        {locationStatus === "verified" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">
                Location verified! You can now join the quiz.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
