import {TimeSpan} from "./TimeSpanAsserts.ts";

export interface BloodCenterApiResponse {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  unitsCapacity: number;
  rbcUnits: number;
  plateletsUnits: number;
  plasmaUnits: number;
  isCentralReserve: boolean;
  slotsCapacity: number;
  openByTime: string;
  closeByTime: string;
  distance: number;
}

export interface BloodCenter {
  id: number;
  name: string;
  distance: string;
  rbc: number;
  capacity: number;
  openBy: TimeSpan;
  closeBy: TimeSpan;
  latitude: string;
  longitude: string;
}
