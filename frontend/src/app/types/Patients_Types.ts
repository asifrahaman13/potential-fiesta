type HealthDataPoint = {
  systol_blood_pressure?: number;
  diastol_blood_pressure?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  body_temperature?: number;
  blood_temperature?: number;
  step_count?: number;
  calories_burned?: number;
  distance_travelled?: number;
  sleep_duration?: number;
  water_consumed?: number;
  caffeine_consumed?: number;
  alcohol_consumed?: number;
  weight?: number;
  timestamp: number;
};

type Summary = {
  summary: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

type QRInfo = {
  mrn: string;
  url: string;
  password: string;
};

export type PatientData = {
  _id: string;
  doctor_username: string;
  detail: string | null;
  details: string[];
  visitId: string;
  mrn: string;
  date: string;
  patient_name: string;
  timestamp: string;
  dob: string;
  gender: string;
  prev: string | null;
  user_id: string;
  summary: Summary;
  data: HealthDataPoint[];
  qr: QRInfo;
};
