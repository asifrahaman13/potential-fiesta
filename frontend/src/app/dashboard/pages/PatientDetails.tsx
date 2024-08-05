import React from 'react';
import { PatientData } from './Patients';

// Props type for the PatientDetail component
type PatientDetailProps = {
  patient: PatientData;
};

// PatientDetail component
const PatientDetail: React.FC<PatientDetailProps> = ({ patient }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 mb-4">
      <h2 className="text-3xl font-bold mb-4">{patient?.patient_name}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Doctor:</strong> {patient?.doctor_username}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Detail:</strong> {patient?.detail ?? 'N/A'}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Visit ID:</strong> {patient?.visitId}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>MRN:</strong> {patient?.mrn}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Visit Date:</strong>{' '}
        {new Date(patient?.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>DOB:</strong> {new Date(patient?.dob).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Gender:</strong> {patient?.gender}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Previous Visit:</strong> {patient?.prev ?? 'N/A'}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Summary:</strong>
      </p>
      <ul className="ml-4 list-disc text-gray-600 mb-2">
        <li>
          <strong>Summary:</strong> {patient?.summary.summary}
        </li>
        <li>
          <strong>Subjective:</strong> {patient?.summary.subjective}
        </li>
        <li>
          <strong>Objective:</strong> {patient?.summary.objective}
        </li>
        <li>
          <strong>Assessment:</strong> {patient?.summary.assessment}
        </li>
        <li>
          <strong>Plan:</strong> {patient?.summary.plan}
        </li>
      </ul>
      <p className="text-gray-600 mb-2">
        <strong>Health Data Points:</strong>
      </p>
      <ul className="ml-4 list-disc text-gray-600 mb-2">
        {patient?.data.map((dataPoint, index) => (
          <li key={index}>
            <div>
              <strong>Timestamp:</strong>{' '}
              {new Date(dataPoint.timestamp * 1000).toLocaleString()}
            </div>
            {dataPoint.systol_blood_pressure && (
              <div>Systolic BP: {dataPoint.systol_blood_pressure} mmHg</div>
            )}
            {dataPoint.diastol_blood_pressure && (
              <div>Diastolic BP: {dataPoint.diastol_blood_pressure} mmHg</div>
            )}
            {dataPoint.heart_rate && (
              <div>Heart Rate: {dataPoint.heart_rate} bpm</div>
            )}
            {dataPoint.respiratory_rate && (
              <div>Respiratory Rate: {dataPoint.respiratory_rate} bpm</div>
            )}
            {dataPoint.body_temperature && (
              <div>Body Temperature: {dataPoint.body_temperature} °C</div>
            )}
            {dataPoint.blood_temperature && (
              <div>Blood Temperature: {dataPoint.blood_temperature} °C</div>
            )}
            {dataPoint.step_count && (
              <div>Step Count: {dataPoint.step_count}</div>
            )}
            {dataPoint.calories_burned && (
              <div>Calories Burned: {dataPoint.calories_burned}</div>
            )}
            {dataPoint.distance_travelled && (
              <div>Distance Travelled: {dataPoint.distance_travelled} km</div>
            )}
            {dataPoint.sleep_duration && (
              <div>Sleep Duration: {dataPoint.sleep_duration} hours</div>
            )}
            {dataPoint.water_consumed && (
              <div>Water Consumed: {dataPoint.water_consumed} L</div>
            )}
            {dataPoint.caffeine_consumed && (
              <div>Caffeine Consumed: {dataPoint.caffeine_consumed} mg</div>
            )}
            {dataPoint.alcohol_consumed && (
              <div>Alcohol Consumed: {dataPoint.alcohol_consumed} mL</div>
            )}
            {dataPoint.weight && <div>Weight: {dataPoint.weight} kg</div>}
          </li>
        ))}
      </ul>
      <p className="text-gray-600 mb-2">
        <strong>QR Info:</strong>
      </p>
      <ul className="ml-4 list-disc text-gray-600 mb-2">
        <li>
          <strong>MRN:</strong> {patient?.qr.mrn}
        </li>
        <li>
          <strong>URL:</strong> {patient?.qr.url}
        </li>
        <li>
          <strong>Password:</strong> {patient?.qr.password}
        </li>
      </ul>
    </div>
  );
};

export default PatientDetail;
