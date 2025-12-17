export interface IrrigationSchedule {
  time: string;
  weekDays: string[];
}

export function getNextScheduleTimeLeft(schedule: IrrigationSchedule | null | undefined): string {
  if (!schedule || !schedule.weekDays?.length || !schedule.time) {
    return '--';
  }

  const weekdayMap: { [key: string]: number } = {
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
    'Domingo': 0,
  };

  const [hours, minutes] = schedule.time.split(':').map(Number);
  const now = new Date();
  const today = now.getDay();
  const selectedDays = schedule.weekDays.map(day => weekdayMap[day]).sort((a, b) => a - b);

  let nextIrrigationDate = new Date();
  nextIrrigationDate.setHours(hours, minutes, 0, 0);
  nextIrrigationDate.setSeconds(0, 0);

  const todayIsSelected = selectedDays.includes(today);
  const timeHasPassed = nextIrrigationDate < now;

  if (todayIsSelected && !timeHasPassed) {
    nextIrrigationDate = new Date();
    nextIrrigationDate.setHours(hours, minutes, 0, 0);
    nextIrrigationDate.setSeconds(0, 0);
  } else {
    let daysToAdd = 0;
    let found = false;

    for (let i = 0; i < 7; i++) {
      const checkDay = (today + i) % 7;
      if (selectedDays.includes(checkDay)) {
        if (i === 0 && timeHasPassed) {
          continue;
        }
        daysToAdd = i === 0 ? 0 : i;
        found = true;
        break;
      }
    }

    if (!found) {
      const nextDay = selectedDays.find(day => day > today) || selectedDays[0];
      daysToAdd = nextDay > today ? nextDay - today : (7 - today) + nextDay;
    }

    nextIrrigationDate = new Date();
    nextIrrigationDate.setDate(now.getDate() + daysToAdd);
    nextIrrigationDate.setHours(hours, minutes, 0, 0);
    nextIrrigationDate.setSeconds(0, 0);
  }

  const timeLeftMs = nextIrrigationDate.getTime() - now.getTime();
  const timeLeftMinutes = Math.floor(timeLeftMs / (60 * 1000));
  const hoursLeft = Math.floor(timeLeftMinutes / 60);
  const minutesLeft = timeLeftMinutes % 60;
  const daysLeft = Math.floor(timeLeftMinutes / (24 * 60));

  let timeLeftText = '';
  if (daysLeft > 0) {
    timeLeftText = `${daysLeft}d ${hoursLeft % 24}h`;
  } else if (hoursLeft > 0) {
    timeLeftText = `${hoursLeft}h ${minutesLeft}min`;
  } else {
    timeLeftText = `${minutesLeft}min`;
  }

  return timeLeftText;
}

export function getNextIrrigationDate(schedule: IrrigationSchedule | null | undefined): Date | null {
  if (!schedule || !schedule.weekDays?.length || !schedule.time) {
    return null;
  }

  const weekdayMap: { [key: string]: number } = {
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
    'Domingo': 0,
  };

  const [hours, minutes] = schedule.time.split(':').map(Number);
  const now = new Date();
  const today = now.getDay();
  const selectedDays = schedule.weekDays.map(day => weekdayMap[day]).sort((a, b) => a - b);

  let nextIrrigationDate = new Date();
  nextIrrigationDate.setHours(hours, minutes, 0, 0);
  nextIrrigationDate.setSeconds(0, 0);

  const todayIsSelected = selectedDays.includes(today);
  const timeHasPassed = nextIrrigationDate < now;

  if (todayIsSelected && !timeHasPassed) {
    nextIrrigationDate = new Date();
    nextIrrigationDate.setHours(hours, minutes, 0, 0);
    nextIrrigationDate.setSeconds(0, 0);
  } else {
    let daysToAdd = 0;
    let found = false;

    for (let i = 0; i < 7; i++) {
      const checkDay = (today + i) % 7;
      if (selectedDays.includes(checkDay)) {
        if (i === 0 && timeHasPassed) {
          continue;
        }
        daysToAdd = i === 0 ? 0 : i;
        found = true;
        break;
      }
    }

    if (!found) {
      const nextDay = selectedDays.find(day => day > today) || selectedDays[0];
      daysToAdd = nextDay > today ? nextDay - today : (7 - today) + nextDay;
    }

    nextIrrigationDate = new Date();
    nextIrrigationDate.setDate(now.getDate() + daysToAdd);
    nextIrrigationDate.setHours(hours, minutes, 0, 0);
    nextIrrigationDate.setSeconds(0, 0);
  }

  return nextIrrigationDate;
}

// Parse zone duration from "MM:SS" format to seconds
export function parseZoneDuration(duration: string): number {
  const parts = duration.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds)) return 0;
  return minutes * 60 + seconds;
}

// Check if irrigation is currently active based on schedule + zone durations
export function isIrrigationActive(
  schedule: IrrigationSchedule | null | undefined,
  zones: { zona1: string; zona2: string } | null | undefined
): { isActive: boolean; endTime: number | null } {
  if (!schedule || !schedule.weekDays?.length || !schedule.time || !zones) {
    return { isActive: false, endTime: null };
  }

  const weekdayMap: { [key: string]: number } = {
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
    'Domingo': 0,
  };

  const [hours, minutes] = schedule.time.split(':').map(Number);
  const now = new Date();
  const today = now.getDay();
  const selectedDays = schedule.weekDays.map(day => weekdayMap[day]);

  // Check if today is a scheduled day
  if (!selectedDays.includes(today)) {
    return { isActive: false, endTime: null };
  }

  // Calculate today's irrigation start time
  const irrigationStart = new Date();
  irrigationStart.setHours(hours, minutes, 0, 0);
  irrigationStart.setSeconds(0, 0);

  // Parse zone durations
  const zone1Seconds = parseZoneDuration(zones.zona1);
  const zone2Seconds = parseZoneDuration(zones.zona2);
  const longestZoneSeconds = Math.max(zone1Seconds, zone2Seconds);

  if (longestZoneSeconds === 0) {
    return { isActive: false, endTime: null };
  }

  // Calculate irrigation end time (start + longest zone duration)
  const irrigationEnd = new Date(irrigationStart.getTime() + longestZoneSeconds * 1000);

  // Check if current time is between start and end
  const isActive = now >= irrigationStart && now < irrigationEnd;

  return {
    isActive,
    endTime: isActive ? Math.floor(irrigationEnd.getTime() / 1000) : null, // Return as Unix timestamp in seconds
  };
}

