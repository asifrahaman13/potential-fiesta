import axios from 'axios';

async function fetchHistory(access_token: string, patientId: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/get-patient`,
      { visitId: patientId },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response && response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getPatientHisory(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/get-data`,
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log('the response is ', response);
    return response;
  } catch (err) {
    console.log(err);
  }
}

function getTimeString() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getDateString() {
  const timestamp = Date.now(); // Example timestamp
  const date = new Date(timestamp);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function saveData(access_token: string, data: any) {
  const { details, mrn, date, dob, timestamp, gender, visitId, patient_name } =
    data;
  console.log(
    'the dtails received',
    details,
    mrn,
    date,
    dob,
    timestamp,
    gender,
    visitId,
    patient_name,
    getDateString(),
    getTimeString()
  );
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/store-data`,
      {
        details: details,
        visitId: visitId,
        patient_name: patient_name,
        mrn: mrn,
        date: getDateString(),
        dob: dob,
        gender: gender,
        timestamp: getTimeString(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function appendData(
  access_token: string,
  patientId: string,
  detail: string
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/append-data`,
      {
        detail: detail,
        visitId: patientId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function confirmSave(
  access_token: string,
  patientId: string,
  details: any,
  summary_details: any
) {
  console.log(access_token, patientId, details, summary_details);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update`,
      { visitId: patientId, details: details, summary: summary_details },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err: any) {
    throw new Error(err);
  }
}

async function getSummary(access_token: string, patientId: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/get-summary`,
      { visitId: patientId },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function sendDetailedData(access_token: string, data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/store-for-csv-data`,

      data,
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      console.log(response);
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

async function generateSummary(
  access_token: string,
  patientId: string,
  data: any
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/generate-summary`,
      { patientId, data },
      {
        headers: {
          'Content-Type': 'application/json',
          APISECRET: process.env.NEXT_PUBLIC_APISECRET,
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 200) {
      return response;
    }
  } catch (err: any) {
    throw new Error(err);
  }
}

export {
  fetchHistory,
  getPatientHisory,
  saveData,
  appendData,
  confirmSave,
  getSummary,
  sendDetailedData,
  generateSummary,
};
