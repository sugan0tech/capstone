export interface DonationSlot {
  id: number;
  slotTime: string;
  slotStatus: string;
  donorId: number;
  centerId: number;
  centerName: string;
}

export const formatDateToIST = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleString("en-IN", options);
};
