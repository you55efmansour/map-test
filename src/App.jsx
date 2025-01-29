import "./App.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import infData from "./data/data.json";
import { useEffect, useState } from "react";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
function App() {


  // map position
  const mPosition = [25.03418922, 121.4506683];


  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `Water Level: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Water Level",
        },
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value) => `${value}`,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
      },
    },
  };

  // Reference lines for thresholds
  const thresholds = [
    { value: 2, label: "safe", color: "green" },
    { value: 4, label: "warining", color: "orange" },
    { value: 5, label: "danger", color: "red" },
  ];
  // Add custom plugin for threshold lines
  const plugins = [
    {
      id: "thresholdLines",
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        thresholds.forEach((threshold) => {
          const y = scales.y.getPixelForValue(threshold.value);
          ctx.save();
          ctx.strokeStyle = threshold.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(chartArea.right, y);
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = threshold.color;
          ctx.fillText(
            threshold.label,
            chartArea.right - chartArea.right / 2 + 10,
            y - 10
          );
        });
      },
    },
  ];

  return (
    <div className="App">
      <MapContainer center={mPosition} zoom={13} style={{ height: "100vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {infData.mapDetails.map((e) => (
          <CircleMarker
            center={e.markPostion}
            radius={20}
            color="blue"
            fillColor="blue"
            fillOpacity={0.6}
            key={e.id}
          >
            <Popup>
              <div className="max-w-lg mx-auto p-4 bg-card text-card-foreground rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">
                  🌊 River forecast
                </h2>
                <p className="text-muted-foreground">Discharge in m³/s</p>
                <div className="relative mt-4">
                  <div style={{ height: "250px", width: "100%" }}>
                    <Line
                      data={{
                        labels: e.time,
                        datasets: [
                          {
                            label: "Water Level",
                            data: e.waterLevel,
                            fill: true,
                            backgroundColor: "rgba(135, 206, 250, 0.5)",
                            borderColor: "rgba(30, 144, 255, 1)",
                            borderWidth: 2,
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={options}
                      plugins={plugins}
                    />
                  </div>
                  
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Gauge information{" "}
                    <span className="text-muted-foreground">i</span>
                  </h3>
                  <p className="text-muted-foreground">
                    Lower-confidence gauge
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      River gauge ID: <strong>hybas_4121522810</strong>
                    </li>
                    <li>
                      Source: <strong>HYBAS</strong>
                    </li>
                    <li>
                      Lat/Long: <strong>23.497917, 121.256250</strong>
                    </li>
                    <li>
                      Gauge station name: <strong>-</strong>
                    </li>
                    <li>
                      Inundation map when alerting: <strong>No</strong>
                    </li>
                    <li>
                      Basin size (km²): <strong>154.4</strong>
                    </li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Gauge thresholds</h3>
                  <p className="text-muted-foreground">Unit of measure</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
