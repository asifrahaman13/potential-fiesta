import React, { useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, LineController } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, LineController);


export interface HealthData {
  weight?: number;
  sugar_level: number;
  systol_blood_pressure?: number;
  diastol_blood_pressure?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  body_temperature?: number;
  step_count?: number;
  calories_burned?: number;
  distance_travelled?: number;
  sleep_duration?: number;
  water_consumed?: number;
  caffeine_consumed: number;
  alcohol_consumed: number;
  timestamp: number;
}

export type MetricInfo = {
  [K in keyof HealthData]: {
    displayName: string;
    color: string;
  };
};

const metricInfo: MetricInfo = {
  weight: { displayName: "Weight", color: "rgba(237, 142, 174, 1)" },
  sugar_level: { displayName: "Sugar Level", color: "rgba(255, 0, 255, 0.5)" },
  systol_blood_pressure: {
    displayName: "Systolic Blood Pressure",
    color: "rgba(255, 0, 0, 0.5)",
  },
  diastol_blood_pressure: {
    displayName: "Diastolic Blood Pressure",
    color: "rgba(0, 0, 255, 0.5)",
  },
  heart_rate: { displayName: "Heart Rate", color: "rgba(0, 255, 0, 0.5)" },
  respiratory_rate: {
    displayName: "Respiratory Rate",
    color: "rgba(255, 165, 0, 0.5)",
  },
  body_temperature: {
    displayName: "Body Temperature",
    color: "rgba(0, 255, 255, 0.5)",
  },
  step_count: { displayName: "Step Count", color: "rgba(237, 142, 174, 1)" },
  calories_burned: {
    displayName: "Calories Burned",
    color: "rgba(237, 237, 142, 1)",
  },
  distance_travelled: {
    displayName: "Distance Travelled",
    color: "rgba(242, 180, 138, 1)",
  },
  sleep_duration: {
    displayName: "Sleep Duration",
    color: "rgba(200, 240, 151, 1)",
  },
  water_consumed: {
    displayName: "Water Consumed",
    color: "rgba(126, 154, 247, 1)",
  },
  caffeine_consumed: {
    displayName: "Caffeine Consumed",
    color: "rgba(225, 142, 230, 1)",
  },
  alcohol_consumed: {
    displayName: "Alcohol Consumed",
    color: "rgba(227, 144, 138, 1)",
  },
  timestamp: {
    displayName: "Your frequency of entering data",
    color: "rgba(128, 196, 188, 1)",
  },
};

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
          const response = await axios.get(
            "http://127.0.0.1:8000/patient/patient-graphs/user"
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

  const chartConfig = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
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
        {/* <button
          // onClick={exportQuantitativeData}
          className="text-blue-500 underline"
        >
          Export 📧
        </button> */}
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
                        backgroundColor: metricInfo[metricKey]?.color
                          ? `${metricInfo[metricKey].color}33`
                          : "rgba(0, 0, 0, 0.3)",
                      },
                    ],
                  }}
                  width={400}
                  height={200}
                  // options={chartConfig}
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
