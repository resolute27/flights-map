export interface Flight {
  id: number;
  year: number;
  month: number;
  day: number;
  dep_time: number;
  sched_dep_time: number;
  dep_delay: number;
  arr_time: number;
  sched_arr_time: number;
  arr_delay: number;
  carrier: string;
  flight: number;
  tailnum: string;
  origin: string;
  dest: string;
  air_time: number;
  distance: number;
  hour: number;
  minute: number;
  time_hour: string;
  name: string;
}

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  country_code: string;
  region_name: string;
  latitude: number;
  longitude: number;
}
