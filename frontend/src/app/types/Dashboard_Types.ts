export interface PageProps {
  patientId: string;
  patientName: string;
}

type Medication = {
  MedicationName: string;
  Dosage: string;
};

export type VitalSigns = {
  Heart_Rate: string;
  Blood_Pressure: string;
  Respiratory_Rate: string;
  Temperature: string;
  Oxygen_Saturation: string;
};

type Problem = {
  Problem_Number: number;
  Problem_Description: string;
};

type SubjectiveData = {
  History_of_PresentIllness: string;
  PertinentPastMedicalHistory: string;
  Review_of_Systems: string;
  Current_Medications: Medication[];
  Medication_Allergies: string;
  Family_History: string;
  Social_History: string;
};

type ObjectiveData = {
  VitalSigns: VitalSigns;
  Physical_Exam: string;
  Lab_Data: string;
};

type AssessmentData = {
  Assessment_Description: string;
  ProblemList: Problem[];
  Differential_Diagnoses: string[];
};

export type TreatmentPlan = {
  Patient_Education: string;
  Pharmacotherapy: string;
  Other_Therapeutic_Procedures: string;
};

type PlanData = {
  Diagnostic_Plan: string;
  Treatment_Plan: TreatmentPlan;
  FollowUp: string;
};

export type Data = {
  Summary: string;
  Subjective: SubjectiveData;
  Objective: ObjectiveData;
  Assessment: AssessmentData;
  Plan: PlanData;
  transcript: string[];
};

export interface HealthData {
  weight?: number;
  sugar_level: number;
  systol_blood_pressure?: number;
  diastol_blood_pressure?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  body_temperature?: number;
  step_count?: number;
  calories_burned?: number;
  distance_travelled?: number;
  sleep_duration?: number;
  water_consumed?: number;
  caffeine_consumed: number;
  alcohol_consumed: number;
  timestamp: number;
}

export type MetricInfo = {
  [K in keyof HealthData]: {
    displayName: string;
    color: string;
  };
};

export const metricInfo: MetricInfo = {
  weight: { displayName: 'Weight', color: 'rgba(237, 142, 174, 1)' },
  sugar_level: { displayName: 'Sugar Level', color: 'rgba(255, 0, 255, 0.5)' },
  systol_blood_pressure: {
    displayName: 'Systolic Blood Pressure',
    color: 'rgba(255, 0, 0, 0.5)',
  },
  diastol_blood_pressure: {
    displayName: 'Diastolic Blood Pressure',
    color: 'rgba(0, 0, 255, 0.5)',
  },
  heart_rate: { displayName: 'Heart Rate', color: 'rgba(0, 255, 0, 0.5)' },
  respiratory_rate: {
    displayName: 'Respiratory Rate',
    color: 'rgba(255, 165, 0, 0.5)',
  },
  body_temperature: {
    displayName: 'Body Temperature',
    color: 'rgba(0, 255, 255, 0.5)',
  },
  step_count: { displayName: 'Step Count', color: 'rgba(237, 142, 174, 1)' },
  calories_burned: {
    displayName: 'Calories Burned',
    color: 'rgba(237, 237, 142, 1)',
  },
  distance_travelled: {
    displayName: 'Distance Travelled',
    color: 'rgba(242, 180, 138, 1)',
  },
  sleep_duration: {
    displayName: 'Sleep Duration',
    color: 'rgba(200, 240, 151, 1)',
  },
  water_consumed: {
    displayName: 'Water Consumed',
    color: 'rgba(126, 154, 247, 1)',
  },
  caffeine_consumed: {
    displayName: 'Caffeine Consumed',
    color: 'rgba(225, 142, 230, 1)',
  },
  alcohol_consumed: {
    displayName: 'Alcohol Consumed',
    color: 'rgba(227, 144, 138, 1)',
  },
  timestamp: {
    displayName: 'Your frequency of entering data',
    color: 'rgba(128, 196, 188, 1)',
  },
};
