"use client";
import { newPatient, startNewPatient, setPatientData, resetData } from "@/lib/features/dashboard/pollsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { saveData } from "@/app/api/patients/history";
import { setAllHistory, appendCurrentHistory } from "@/lib/features/history/allHistorySlice";


const CreatePoll = () => {

function getTimeString() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
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
  const pollsSlice = useSelector((state: RootState) => state.polls);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(setPatientData({ name: name, value: value }));
  };

  async function handleSubmit() {
    // Example timestamp
    const formattedTime = getTimeString();
    console.log(formattedTime);
    const formatCurrDate = getDateString();
    console.log(formatCurrDate)
    dispatch(appendCurrentHistory({ newData: pollsSlice.patientDetails }));
    dispatch(setPatientData({ name: "timestamp", value: formattedTime }));
    dispatch(setPatientData({ name: "date", value: formatCurrDate }));
    console.log("the data+++++++++++++++++++++++++++", pollsSlice.patientDetails);
    try {
       const access_token = localStorage.getItem("access_token") || "";
      const response = await saveData(access_token, pollsSlice.patientDetails);
      // dispatch(resetData())
    } catch (err) {
      console.log(err);
    }
   
  }

  return (
    <>
      {pollsSlice.showModal ? (
        <>
          <div className="backdrop-blur-sm bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="min-h-screen w-full flex flex-row items-center justify-center">
              <div className="bg-white h-full md:h-3/4 md:w-1/5 p-4 rounded-xl">
                <div className="flex flex-row">
                  <div className="w-1/2 font-semibold mb-8">New Visit</div>
                  <div className="w-1/2 flex justify-end ">
                    <button
                      className="bg-Cross rounded-3xl h-6 w-6"
                      onClick={(e) => {
                        dispatch(newPatient());
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row ">
                  <div className="w-full p-4 bg-Almost-white flex flex-col gap-2 ">
                    <div className="">The system will allow users to auto-pull appointments from EHR or search for patients by name or MRN once the EHR integration is activated during the pilot.</div>

                    <div className="mb-8">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Visit ID
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="visitId"
                          id="iwantto"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.visitId}
                          onChange={(e) => {
                            dispatch(setPatientData({ visitId: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Patient name
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={2}
                          name="patient_name"
                          id="tellusmore"
                          className="block h-full w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          placeholder="Eg. Adam Stephen"
                          value={pollsSlice.patientDetails.patient_name}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "patient_name", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-8">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        MRN
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="mrn"
                          id="MRN"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.mrn}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "mrn", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        DOB
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="dob"
                          id="dob"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.dob}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "dob", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-8">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Gender
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="gender"
                          id="gender"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.gender}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "gender", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full  flex justify-end mt-4">
                      <button
                        className="bg-black text-white p-3 rounded-xl"
                        onClick={(e) => {
                          dispatch(startNewPatient());
                          handleSubmit();
                        }}
                      >
                        Create visit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CreatePoll;
