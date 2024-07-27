export type TimeSpan = {
  hours: number;
  minutes: number;
  seconds: number;
};

export const parseTimeSpan = (timespanString: string): TimeSpan => {
  const parts = timespanString.split(":");
  if (parts.length !== 3) throw new Error("Invalid TimeSpan format");

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  return {
    hours,
    minutes,
    seconds,
  };
};

export const formatTimeSpan = (timeSpan: TimeSpan): string => {
  const hours = timeSpan.hours.toString().padStart(2, "0");
  const minutes = timeSpan.minutes.toString().padStart(2, "0");
  const seconds = timeSpan.seconds.toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimeSpan12Hour = (timeSpan: TimeSpan): string => {
  let hours = timeSpan.hours;
  const minutes = timeSpan.minutes.toString().padStart(2, "0");
  // const seconds = timeSpan.seconds.toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursString = hours.toString().padStart(2, "0");

  return `${hoursString}:${minutes} ${period}`;
};
