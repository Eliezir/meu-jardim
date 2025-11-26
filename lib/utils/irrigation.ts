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

