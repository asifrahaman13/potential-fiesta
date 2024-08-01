"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const newUUID = uuidv4().replace(/-/g, "").substring(0, 10);
    setUrl("http://localhost:3000/" + "/patient/"+newUUID);
  }, []);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-xl">QR code</p>
          <div>{url}</div>
          <div className="">{url && <QRCode value={url} size={250} />}</div>
        </div>
      </div>
    </>
  );
};

export default QRCodeGenerator;
