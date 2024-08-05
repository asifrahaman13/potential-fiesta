'use client';
import axios from 'axios';
import React, { useEffect } from 'react';
import PatientDetail from '../pages/PatientDetails';
import { PatientData } from '@/app/types/Patients_Types';

export default function Page() {
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
    <div className=" bg-gray-100 min-h-screen overflow-y-scroll flex flex-col items-center">
      {currentPatient === null && (
        <>
          <h1 className="text-4xl font-semibold mb-8">Patients</h1>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-screen-2xl w-full px-4">
            {patients.map((patient, index) => (
              <button
                key={index}
                className="bg-white rounded-lg shadow-lg w-full transition-transform transform hover:scale-105"
                onClick={() => setCurrentPatient(patient)}
              >
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-2">
                    Patient: {patient.patient_name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>DOB:</strong> {patient.dob}
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
                    <strong>Visit Date:</strong> {patient.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {currentPatient && (
        <>
          <div className="bg-white w-3/4 my-12">
            <button
              onClick={() => {
                setCurrentPatient(null);
              }}
              className="px-6 p-4 bg-gray-50 rounded-md"
            >
              Back
            </button>
            <PatientDetail patient={currentPatient} />
          </div>
        </>
      )}
    </div>
  );
}
