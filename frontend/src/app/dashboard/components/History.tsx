/* eslint-disable @next/next/no-img-element */
"use client";
import Loader from "@/app/components/Loader";
import React, { useEffect, useState } from "react";
import {
  fetchHistory,
  confirmSave,
  getSummary,
} from "@/app/api/patients/history";
import { PageProps } from "@/app/types/Dashboard_Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Success from "./Success";

import {
  changeSummaryFields,
  setBasicData,
  setTranscriptions,
} from "@/lib/features/history/historySlice";
import { changeTranscript } from "@/lib/features/history/historySlice";

const History: React.FC<PageProps> = ({ patientId, patientName }) => {
  const historySlice = useSelector((state: RootState) => state.history);
  const [date, setDate] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [patientData, setPatientData] = useState({
    mrn: "",
    patient_name: "",
    gender: "",
    age: "",
    dob: "",
  });
  const toggleFaq = (index: any) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  useEffect(() => {
    async function GetPatientHisory() {
      if (patientId === "") {
        setFetching(false);
        return;
      }
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          const summary = await getSummary(access_token, patientId);

          if (summary?.status === 200) {
            dispatch(setBasicData({ summary: summary.data }));
            setFetching(false);
          }
          const response = await fetchHistory(access_token, patientId);
          if (response?.status === 200) {
            console.log("The history################", response.data);
            setDate(response.data.date);
            setPatientData(response.data);
            if (response?.data.details) {
              console.log(
                "sdfsdf###############################",
                response?.data.details
              );
              dispatch(setTranscriptions({ details: response?.data.details }));
              console.log(response?.data.details);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    GetPatientHisory();
  }, [dispatch, patientId]);
  const [message, setMessage] = useState({
    msg: "",
    statuscode: 0,
  });
  async function ConfirmSave() {
    try {
      const access_token = localStorage.getItem("access_token") || "";
      const response = await confirmSave(
        access_token,
        patientId,
        historySlice.details,
        JSON.parse(JSON.stringify(historySlice.summary))
      );
      if (response?.status === 200) {
        setMessage({
          msg: "Data is saved successfully and uploaded to s3",
          statuscode: 200,
        });
      }
    } catch (error) {
      console.log(error);
    }
    handleShowToast();
  }

  const [showToast, setShowToast] = useState(false);

  // Function to show the toast
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds (adjust as needed)
  };

  return (
    <>
      <div className="relative">
        {showToast && <Success message={message} />}
      </div>

      {fetching == true && <Loader />}
      <div className=" w-full  xl:flex">
        {patientId === "" && (
          <>
            <div className="w-full flex items-center justify-center">
              {" "}
              Nothing to display. Please click on the New visit tab to start
              creating one.
            </div>
          </>
        )}

        {patientId !== "" && (
          <>
            {" "}
            <div className="w-full xl:w-2/3 p-4 flex flex-col gap-4 overflow-y-scroll no-scrollbar">
              <div className="w-full flex ">
                <div className="w-full">
                  <div className="border rounded-xl bg-white p-4 flex flex-col gap-4">
                    <div className="text-2xl font-medium">{patientName}</div>
                    <div className="flex text-gray-400 gap-2">
                      <div>{patientData.gender}</div>
                      <div>{patientData.age}</div>|
                      <div> 2469 Peachtree Ln, Atlanta, GA 30319</div>
                    </div>
                    <div className="flex text-gray-400 gap-2">
                      <div>
                        <span className="text-gray-700">Dob: </span>
                        <span>{patientData.dob}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">MRN: </span>
                        <span>{patientData.mrn}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Last Visit: </span>
                        <span>1 August </span>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/review.svg" alt="" />
                        <div className="text-gray-500">Review</div>
                      </button>
                      <button className="flex items-center justify-center gap-2 ">
                        <img src="/images/visits/notes.svg" alt="" />
                        <div className="border-b-2 border-indigo-500 ">
                          Notes
                        </div>
                      </button>
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/documentation.svg" alt="" />
                        <div className="text-gray-500">Documentation</div>
                      </button>
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/instructions.svg" alt="" />
                        <div className="text-gray-500">Instructions</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div
                    key={1}
                    className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Summary</h2>
                      <img
                        src="/images/UI icon_info_filled.svg"
                        alt=""
                        className="p-2"
                      />
                      <img
                        src="/images/copy.svg" // Path to your image file inside the public directory
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${
                          activeIndex === 0 ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(1)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            activeIndex === 1
                              ? "M19 9l-7 7-7-7"
                              : "M5 15l7-7 7 7"
                          }
                        />
                      </svg>
                    </div>

                    <textarea
                      className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap break-words word-wrap"
                      value={historySlice?.summary.summary}
                      onChange={(e) => {
                        dispatch(
                          changeSummaryFields({
                            fieldName: "summary",
                            summary: e.target.value,
                          })
                        );
                      }}
                      rows={8}
                      
                    ></textarea>
                  </div>

                  <div
                    key={2}
                    className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Subjective</h2>
                      <img
                        src="/images/UI icon_info_filled.svg"
                        alt=""
                        className="p-2"
                      />
                      <img src="/images/copy.svg" alt="" className=" ml-auto" />
                      <svg
                        className={`w-6 h-6 ${
                          activeIndex === 1 ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(2)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            activeIndex === 2
                              ? "M19 9l-7 7-7-7"
                              : "M5 15l7-7 7 7"
                          }
                        />
                      </svg>
                    </div>

                    <>
                      <textarea
                        className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
                        value={historySlice?.summary?.subjective}
                        onChange={(e) => {
                          dispatch(
                            changeSummaryFields({
                              fieldName: "subjective",
                              summary: e.target.value,
                            })
                          );
                        }}
                        rows={5}
                      ></textarea>
                    </>
                  </div>

                  <div
                    key={3}
                    className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Objective</h2>
                      <img
                        src="/images/UI icon_info_filled.svg"
                        alt=""
                        className="p-2"
                      />
                      <img
                        src="/images/copy.svg"
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${
                          activeIndex === 2 ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(3)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            activeIndex === 3
                              ? "M19 9l-7 7-7-7"
                              : "M5 15l7-7 7 7"
                          }
                        />
                      </svg>
                    </div>

                    <textarea
                      className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
                      value={historySlice?.summary?.objective}
                      onChange={(e) => {
                        dispatch(
                          changeSummaryFields({
                            fieldName: "objective",
                            summary: e.target.value,
                          })
                        );
                      }}
                    ></textarea>
                  </div>

                  <div
                    key={4}
                    className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Assessment </h2>
                      <img
                        src="/images/UI icon_info_filled.svg"
                        alt=""
                        className="p-2"
                      />
                      <img
                        src="/images/copy.svg" // Path to your image file inside the public directory
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${
                          activeIndex === 3 ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(4)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            activeIndex === 4
                              ? "M19 9l-7 7-7-7"
                              : "M5 15l7-7 7 7"
                          }
                        />
                      </svg>
                    </div>

                    <textarea
                      className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
                      value={historySlice?.summary?.assessment}
                      onChange={(e) => {
                        dispatch(
                          changeSummaryFields({
                            fieldName: "assessment",
                            summary: e.target.value,
                          })
                        );
                      }}
                      rows={4}
                    ></textarea>
                  </div>

                  <div
                    key={5}
                    className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold"> Plan</h2>
                      <img
                        src="/images/UI icon_info_filled.svg"
                        alt=""
                        className="p-2"
                      />
                      <img
                        src="/images/copy.svg"
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${
                          activeIndex === 4 ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(5)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            activeIndex === 5
                              ? "M19 9l-7 7-7-7"
                              : "M5 15l7-7 7 7"
                          }
                        />
                      </svg>
                    </div>

                    <textarea
                      className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
                      value={historySlice?.summary?.plan}
                      onChange={(e) => {
                        dispatch(
                          changeSummaryFields({
                            fieldName: "plan",
                            summary: e.target.value,
                          })
                        );
                      }}
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                <div className="w-full flex justify-end ">
                  <div className="bg-purple-500 rounded-xl flex p-4 gap-2">
                    <img
                      src="/images/upload.svg" // Path to your image file inside the public directory
                      alt="Interface Image"
                    />
                    <button
                      className="text-white l"
                      onClick={(e) => {
                        ConfirmSave();
                      }}
                    >
                      Confirm & save
                    </button>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div
              className={` w-full xl:w-1/3 bg-white p-4  h-screen no-scrollbar overflow-y-auto p-b-8 mb-12 flex flex-col gap-4`}
            >
              <div className="flex">
                <div>{">>"}</div>
                <div className="text-xl ml-auto">Transcript</div>
              </div>

              <div className="flex">
                <button className="rounded-2xl border border-yellow-500 p-1 pl-4 pr-4">
                  Full
                </button>
                <div className="text-xl ml-auto flex gap-2 items-center">
                  {/* <div>8:05 min</div> */}
                  <img src="/images/evva/mic.svg" alt="" />
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-6 p-  ">
                {historySlice?.details.map((item, index) => (
                  <>
                    {item != null && item !== "" && (
                      <>
                        {item.substring(0, 9) === "Speaker-1" && (
                          <div key={index}>
                            <div className="flex w-full items-start gap-2">
                              <div className="rounded-full bg-yellow-100 ml-auto flex items-center w-8 h-8 justify-center p-4">
                                1
                              </div>

                              <textarea
                                id="review-text"
                                className="w-full outline-none resize-none "
                                value={item}
                                rows={Math.ceil(item.length / 50)}
                                onChange={(e) => {
                                  dispatch(
                                    changeTranscript({
                                      index: index,
                                      newTranscript: e.target.value,
                                    })
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {item.substring(0, 9) !== "Speaker-1" && (
                          <div key={index}>
                            <div className="flex w-full items-start gap-2">
                              <div className="rounded-full bg-indigo-100 ml-auto flex items-center w-8 h-8 justify-center p-4">
                                2
                              </div>

                              <textarea
                                id="review-text"
                                className="w-full outline-none resize-none "
                                value={item}
                                rows={Math.ceil(item.length / 50)}
                                onChange={(e) => {
                                  dispatch(
                                    changeTranscript({
                                      index: index,
                                      newTranscript: e.target.value,
                                    })
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default History;
