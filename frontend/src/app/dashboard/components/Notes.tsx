/* eslint-disable @next/next/no-img-element */
import { confirmSave } from '@/app/api/patients/history';
import { changeSummaryFields } from '@/lib/features/history/historySlice';
import { RootState } from '@/lib/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
type Patient = {
  patientId: string;
};

const Notes = ({ patientId }: Patient) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFaq = (index: any) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const historySlice = useSelector((state: RootState) => state.history);
  const dispatch = useDispatch();

  async function ConfirmSave() {
    try {
      const access_token = localStorage.getItem('access_token') || '';
      console.log(historySlice.summary, historySlice.details, patientId);
      const response = await confirmSave(
        access_token,
        patientId,
        historySlice.details,
        JSON.parse(JSON.stringify(historySlice.summary))
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <div className=" mb-16">
      <div>
        <div
          key={1}
          className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between cursor-pointer">
            <h2 className="text-lg font-semibold">Summary</h2>
            <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
            <img
              src="/images/copy.svg"
              alt="Interface Image"
              className=" ml-auto"
            />
            <svg
              className={`w-6 h-6 ${
                activeIndex === 0 ? 'transform rotate-180' : ''
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
                d={activeIndex === 1 ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </div>

          <textarea
            className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap break-words word-wrap"
            value={historySlice?.summary?.summary}
            onChange={(e) => {
              dispatch(
                changeSummaryFields({
                  fieldName: 'summary',
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
            <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
            <img src="/images/copy.svg" alt="" className=" ml-auto" />
            <svg
              className={`w-6 h-6 ${
                activeIndex === 1 ? 'transform rotate-180' : ''
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
                d={activeIndex === 2 ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
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
                    fieldName: 'subjective',
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
            <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
            <img
              src="/images/copy.svg"
              alt="Interface Image"
              className=" ml-auto"
            />
            <svg
              className={`w-6 h-6 ${
                activeIndex === 2 ? 'transform rotate-180' : ''
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
                d={activeIndex === 3 ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </div>

          <textarea
            className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
            value={historySlice?.summary?.objective}
            onChange={(e) => {
              dispatch(
                changeSummaryFields({
                  fieldName: 'objective',
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
            <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
            <img
              src="/images/copy.svg" // Path to your image file inside the public directory
              alt="Interface Image"
              className=" ml-auto"
            />
            <svg
              className={`w-6 h-6 ${
                activeIndex === 3 ? 'transform rotate-180' : ''
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
                d={activeIndex === 4 ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </div>

          <textarea
            className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
            value={historySlice?.summary?.assessment}
            onChange={(e) => {
              dispatch(
                changeSummaryFields({
                  fieldName: 'assessment',
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
            <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
            <img
              src="/images/copy.svg"
              alt="Interface Image"
              className=" ml-auto"
            />
            <svg
              className={`w-6 h-6 ${
                activeIndex === 4 ? 'transform rotate-180' : ''
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
                d={activeIndex === 5 ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </div>

          <textarea
            className="text-gray-600 mt-4 outline-none w-full h-auto flex flex-wrap"
            value={historySlice?.summary?.plan}
            onChange={(e) => {
              dispatch(
                changeSummaryFields({
                  fieldName: 'plan',
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
          <img src="/images/upload.svg" alt="Interface Image" />
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
  );
};

export default Notes;
