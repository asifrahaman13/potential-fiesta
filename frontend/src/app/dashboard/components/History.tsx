/* eslint-disable @next/next/no-img-element */
"use client";
import Loader from "@/app/components/Loader";
import React, { useEffect, useState } from "react";
import { fetchHistory, getSummary } from "@/app/api/patients/history";
import { PageProps } from "@/app/types/Dashboard_Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import {
  setBasicData,
  setTranscriptions,
} from "@/lib/features/history/historySlice";
import { changeTranscript } from "@/lib/features/history/historySlice";
import Notes from "./Notes";
import QrCode from "./QrCode";
import PatientGraphs from "./PatientGraphs";

const History: React.FC<PageProps> = ({ patientId, patientName }) => {
  console.log(patientId)
  const historySlice = useSelector((state: RootState) => state.history);
  const [date, setDate] = useState("");
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [patientData, setPatientData] = useState({
    mrn: "",
    patient_name: "",
    gender: "",
    age: "",
    dob: "",
  });

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

  const [header, setHeader] = useState("notes");

  function handleheaderChange(header: string) {
    setHeader(header);
  }

  return (
    <>
      {fetching == true && <Loader />}
      <div className=" w-full  xl:flex">
        {patientId === "" && (
          <>
            <div className="w-full flex items-center justify-center">
              Nothing to display. Please click on the New visit tab to start
              creating one. Or you can find your patient by searching from the left.
            </div>
          </>
        )}

        {patientId !== "" && (
          <>
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
                        <span>{date} </span>
                      </div>
                    </div>
                    <div className="flex gap-8 items-center">
                      <button
                        className="flex items-center justify-center gap-2 "
                        onClick={(e) => {
                          handleheaderChange("notes");
                        }}
                      >
                        <img src="/images/visits/review.svg" alt="" />
                        <div className={`${header == "notes" ? "border-b-2 border-indigo-500" : ""} font-semibold text-gray-500 `}>
                          Notes
                        </div>
                      </button>
                      <button
                        className={` flex flex-row gap-2 items-center`}
                        onClick={(e) => {
                          handleheaderChange("qr-code");
                        }}
                      >
                        <img src="/images/visits/documentation.svg" alt="" />
                        <div className={`${header == "qr-code" ? "border-b-2 border-indigo-500" : ""} font-semibold text-gray-500 flex flex-row gap-2 items-center`}>QR Code</div>
                      </button>
                      <button
                        className={` flex flex-row gap-2 items-center`}
                        onClick={(e) => {
                          handleheaderChange("patient_data");
                        }}
                      >
                        <img src="/images/visits/instructions.svg" alt="" />
                        <div className={`${header == "patient_data" ? "border-b-2 border-indigo-500" : ""} font-semibold text-gray-500 flex flex-row gap-2 items-center`}>Patient data</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {header === "notes" && <Notes patientId={patientId} />}
              {header == "qr-code" && <QrCode mrn={patientData.mrn}/>}
              {header == "patient_data" && <PatientGraphs />}
            </div>
            <div
              className={` w-full xl:w-1/3 bg-white p-4   no-scrollbar overflow-y-auto p-b-8 mb-12 flex flex-col gap-4`}
            >
              <div className="flex">
      
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
              <div className="flex flex-col gap-4 mt-6 h-5/6 overflow-y-scroll no-scrollbar ">
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
