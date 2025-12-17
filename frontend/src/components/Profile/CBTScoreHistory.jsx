import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { API } from "../../api/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const CBTScoreHistory = () => {
  const chartRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [phqScores, setPhqScores] = useState([]);
  const [gadScores, setGadScores] = useState([]);
  const [chartData, setChartData] = useState({ datasets: [] }); // Store chart object here
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  // Update chart object whenever scores change
  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    const ctx = chart.ctx;
    const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
    blueGradient.addColorStop(0, "rgba(96,165,250,0.35)");
    blueGradient.addColorStop(1, "rgba(96,165,250,0.05)");

    const greenGradient = ctx.createLinearGradient(0, 0, 0, 300);
    greenGradient.addColorStop(0, "rgba(134,239,172,0.35)");
    greenGradient.addColorStop(1, "rgba(134,239,172,0.05)");

    setChartData({
      labels,
      datasets: [
        {
          label: "PHQ-9 (Depression)",
          data: phqScores,
          borderColor: "#60A5FA",
          backgroundColor: blueGradient,
          tension: 0.45,
          fill: true,
          pointRadius: 4,
        },
        {
          label: "GAD-7 (Anxiety)",
          data: gadScores,
          borderColor: "#86EFAC",
          backgroundColor: greenGradient,
          tension: 0.45,
          fill: true,
          pointRadius: 4,
        },
      ],
    });
  }, [labels, phqScores, gadScores]);

  const loadData = async () => {
    try {
      const [phqRes, gadRes] = await Promise.all([
        fetch(`${API}/api/analytics/daily?assessmentId=phq9&days=30`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/analytics/daily?assessmentId=gad7&days=30`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const phqJson = await phqRes.json();
      const gadJson = await gadRes.json();
      const phqData = phqJson?.data || [];
      const gadData = gadJson?.data || [];

      const dateMap = {};
      phqData.forEach((d) => { dateMap[d.date] = { phq: d.score, gad: null }; });
      gadData.forEach((d) => {
        if (!dateMap[d.date]) dateMap[d.date] = { phq: null, gad: d.score };
        else dateMap[d.date].gad = d.score;
      });

      const sortedDates = Object.keys(dateMap).sort();

      setLabels(sortedDates.map((d) => new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short" })));
      setPhqScores(sortedDates.map((d) => dateMap[d].phq));
      setGadScores(sortedDates.map((d) => dateMap[d].gad));
    } catch (err) {
      console.error("CBT chart error:", err);
    }
  };

  if (!labels.length) {
    return <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">No assessment data available yet</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-1">CBT Score History</h2>
      <p className="text-sm text-gray-500 mb-6">Tracking your PHQ-9 and GAD-7 scores daily</p>

      <div style={{ height: "300px" }}>
        <Line
          ref={chartRef}
          data={chartData} // Now passing an object, not a function
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
              tooltip: { backgroundColor: "#fff", titleColor: "#111", bodyColor: "#333", borderColor: "#E5E7EB", borderWidth: 1, padding: 12 },
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { color: "#F3F4F6" }, ticks: { stepSize: 5 } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default CBTScoreHistory;