import { useState, useEffect, useRef } from 'react';
import { IrrigationStatus } from '@/lib/firebase/realtime';
import { IrrigationSchedule, isIrrigationActive } from '@/lib/utils/irrigation';

interface CountdownTime {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export function useIrrigationCountdown(
  status: IrrigationStatus | null | undefined,
  schedule: IrrigationSchedule | null | undefined,
  zones: { zona1: string; zona2: string } | null | undefined
): {
  isActive: boolean;
  countdown: CountdownTime | null;
  longestZoneRemaining: CountdownTime | null;
} {
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [longestZoneRemaining, setLongestZoneRemaining] = useState<CountdownTime | null>(null);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Calculate time remaining from Unix timestamp (seconds)
  const calculateTimeRemaining = (endTimeSeconds: number): CountdownTime | null => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const remaining = endTimeSeconds - now;

    if (remaining <= 0) {
      return null;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    let formatted = '';
    if (hours > 0) {
      formatted = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      formatted = `${minutes}m ${seconds}s`;
    } else {
      formatted = `${seconds}s`;
    }

    return {
      totalSeconds: remaining,
      hours,
      minutes,
      seconds,
      formatted,
    };
  };

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Check Firebase status first, then fallback to local calculation
    const firebaseActive = status?.isActive ?? false;
    let longestEndTime: number | null = null;

    if (firebaseActive && status) {
      // Use Firebase status if available
      const zone1End = status.zone1EndTime;
      const zone2End = status.zone2EndTime;

      if (zone1End && zone2End) {
        longestEndTime = Math.max(zone1End, zone2End);
      } else if (zone1End) {
        longestEndTime = zone1End;
      } else if (zone2End) {
        longestEndTime = zone2End;
      }
    }

    // Fallback to local calculation if Firebase status is not active or doesn't have end times
    if (!longestEndTime) {
      const localCheck = isIrrigationActive(schedule, zones);
      if (localCheck.isActive && localCheck.endTime) {
        longestEndTime = localCheck.endTime;
      }
    }

    // Check if end time is in the future (irrigation still active)
    const now = Math.floor(Date.now() / 1000);
    const isActive = longestEndTime !== null && longestEndTime > now;

    if (!isActive || !longestEndTime) {
      setCountdown(null);
      setLongestZoneRemaining(null);
      endTimeRef.current = null;
      return;
    }

    endTimeRef.current = longestEndTime;

    // Calculate initial countdown
    const updateCountdown = () => {
      if (!endTimeRef.current) return;

      const remaining = calculateTimeRemaining(endTimeRef.current);
      
      if (remaining) {
        setCountdown(remaining);
        setLongestZoneRemaining(remaining);
      } else {
        setCountdown(null);
        setLongestZoneRemaining(null);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Initial calculation
    updateCountdown();

    // Update every second
    // In React Native, setInterval returns a number, not NodeJS.Timeout
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status?.isActive, status?.zone1EndTime, status?.zone2EndTime, schedule, zones]);

  // Irrigation is active if we have a valid countdown
  const isActive = longestZoneRemaining !== null;

  return {
    isActive,
    countdown,
    longestZoneRemaining,
  };
}

