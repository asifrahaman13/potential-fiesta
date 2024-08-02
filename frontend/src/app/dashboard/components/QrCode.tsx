"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { headers } from "next/headers";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState<string>("");
  const [password, setRandomPassword] = useState<string>("");

  useEffect(() => {
    const newUUID = uuidv4().replace(/-/g, "").substring(0, 10);
    setUrl("http://localhost:3000" + "/patient/" + newUUID);
    const randomPassword = Math.random().toString(36).slice(-8);
    console.log("randomPassword", randomPassword);
    setRandomPassword(randomPassword);
  }, []);

  async function confirm() {
    const backendUrl = "http://localhost:8000";
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${backendUrl}/users/create-qr`,
        {
          mrn: "sayzputt",
          url: url,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response", response);
    } catch (error) {
      console.error("error", error);
    }
  }

  return (
    <React.Fragment>
      <div className="flex justify-center items-center  bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="w-full flex justify-center items-center p-6">
            <div className="flex flex-col gap-4 w-full">
              <p className="font-semibold text-2xl text-center text-gray-800">
                QR Code
              </p>
              <div className="text-lg font-semibold text-gray-700">URL</div>
              <div className="text-gray-600 truncate">{url}</div>
              <div className="text-lg font-semibold text-gray-700">
                Password
              </div>
              <div className="text-gray-600">{password}</div>
              <div className="flex justify-center mt-4">
                {url && <QRCode value={url} size={250} />}
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 border-t border-gray-200">
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-blue-700 transition duration-200"
              onClick={() => {
                confirm();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QRCodeGenerator;
