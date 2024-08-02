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
      <div>
        <div className="bg-white rounded-lg h-full">
        <div className="w-full  flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-xl">QR code</p>
            <div className="text-lg font-semibold">URL</div>
            <div>{url}</div>
            <div className="text-lg font-semibold">Password</div>
            <div>{password}</div>
            <div className="">{url && <QRCode value={url} size={250} />}</div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div>
            <button
              className="rounded-lg bg-white px-4 py-2 text-gray-500 font-semibold"
              onClick={() => {
                confirm();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QRCodeGenerator;
