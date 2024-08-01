import React, { useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { HealthData } from "@/app/types/Dashboard_Types";
import { metricInfo } from "@/app/types/Dashboard_Types";

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Filler
);

const DataScreen: React.FC = () => {
  const [healthData, setHealthData] = React.useState<HealthData[]>([]);
  const [dataState, setDataState] = React.useState<
    "loading" | "loaded" | "error" | null
  >(null);

  useEffect(() => {
    const getGeneralMetrics = async () => {
      if (dataState !== "loaded") {
        setDataState("loading");
      }
      try {
        const idToken = "some token";
        if (idToken) {
          console.log("Getting general health metrics");
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const response = await axios.get(
            `${backendUrl}/patient/patient-graphs/user`
          );
          if (response?.status === 200) {
            console.log(
              "#############################################",
              response.data
            );
            setHealthData(response.data);
            setDataState("loaded");
          }
        }
      } catch (err) {
        setDataState("error");
      }
    };

    getGeneralMetrics();
  }, [dataState]);

  const extractLabels = (data: HealthData[]): string[] => {
    return data
      .filter((item) => item.timestamp)
      .map((item) => new Date(item.timestamp * 1000).toLocaleTimeString());
  };

  return (
    <div className="bg-white p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-400">PATIENT GRAPH</h1>
        <p className="text-sm mb-4">
          **This screen displays a graph of the general health metrics recorded
          by the user. We strongly recommend users track their health metrics
          periodically and visualize them better with our graphs.
        </p>
      </div>

      {dataState === "loading" && <div>Loading...</div>}

      {dataState === "loaded" && healthData.length > 0 && (
        <div className="flex flex-col items-center">
          {Object.keys(metricInfo).map((key) => {
            const metricKey = key as keyof HealthData;
            const filteredData = healthData.filter(
              (item) => item[metricKey] !== undefined && !isNaN(item[metricKey])
            );

            return (
              <div key={metricKey} className="mb-8 w-full max-w-4xl">
                <h2 className="text-xl font-bold mb-2">
                  {metricInfo[metricKey]?.displayName}
                </h2>
                <Line
                  data={{
                    labels: extractLabels(filteredData),
                    datasets: [
                      {
                        label: metricInfo[metricKey]?.displayName || key,
                        data: filteredData.map(
                          (item) => (item[metricKey] as number) ?? NaN
                        ),
                        borderColor:
                          metricInfo[metricKey]?.color || "rgba(0, 0, 0, 1)",
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: (context) => {
                          const bgColor =
                            metricInfo[metricKey]?.color || "rgba(0, 0, 0, 1)";
                          const alphaColor = bgColor.replace(
                            /rgba?\((\d+), (\d+), (\d+).*/,
                            "rgba($1, $2, $3, 0.1)"
                          );
                          return alphaColor;
                        },
                        cubicInterpolationMode: "monotone", // Curved line
                      },
                    ],
                  }}
                  width={400}
                  height={200}
                  options={{
                    elements: {
                      line: {
                        tension: 0.4, // Smooth the line
                      },
                    },
                    scales: {
                      x: {
                        type: "category",
                      },
                    },
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DataScreen;
