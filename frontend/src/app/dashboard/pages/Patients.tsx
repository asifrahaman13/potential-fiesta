'use client';
import axios from 'axios';
import React, { useEffect } from 'react';
import PatientDetail from './PatientDetails';

// Type representing individual health data points
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

// Type representing the summary information
type Summary = {
  summary: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

// Type representing the QR information
type QRInfo = {
  mrn: string;
  url: string;
  password: string;
};

// Type representing the main patient information
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

const Patients: React.FC = () => {
  const [patients, setPatients] = React.useState<PatientData[]>([]);
  const [currentPatient, setCurrentPatient] =
    React.useState<PatientData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(`${backendUrl}/users/all-patients`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          setPatients(response.data);
        }
      } catch (e: any) {
        console.error(e);
      }
    };

    fetchData();
  }, []);
  return (
    <div className=" bg-gray-100 overflow-y-scroll flex flex-col items-center py-10">
      <h1 className="text-4xl font-semibold mb-8">Patients</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-screen-lg w-full px-4">
        {patients.map((patient, index) => (
          <button
            key={index}
            className="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
            onClick={() => setCurrentPatient(patient)}
          >
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">
                Patient: {patient.patient_name}
              </h2>
              <p className="text-gray-600">
                <strong>DOB:</strong>{' '}
                {new Date(patient.dob).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p className="text-gray-600">
                <strong>Visit ID:</strong> {patient.visitId}
              </p>
              <p className="text-gray-600">
                <strong>MRN:</strong> {patient.mrn}
              </p>
              <p className="text-gray-600">
                <strong>Visit Date:</strong>{' '}
                {new Date(patient.date).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>

      {currentPatient && <PatientDetail patient={currentPatient} />}
    </div>
  );
};

export default Patients;
