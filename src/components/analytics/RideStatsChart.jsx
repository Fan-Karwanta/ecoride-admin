import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RideStatsChart = ({ data }) => {
  // Extract ride data by vehicle type
  const vehicleTypes = ["bike", "auto", "cabEconomy", "cabPremium"];
  const vehicleLabels = ["Bike", "Auto", "Cab Economy", "Cab Premium"];
  
  // Format data for rides count
  const ridesCountData = vehicleTypes.map(
    (type) => data.vehicleStats.rides[type]?.count || 0
  );
  
  // Format data for revenue
  const revenueData = vehicleTypes.map(
    (type) => data.vehicleStats.rides[type]?.totalFare || 0
  );
  
  // Format data for distance
  const distanceData = vehicleTypes.map(
    (type) => data.vehicleStats.rides[type]?.totalDistance || 0
  );

  // Prepare chart data
  const chartData = {
    labels: vehicleLabels,
    datasets: [
      {
        label: "Number of Rides",
        data: ridesCountData,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
        text: "Ride Statistics by Vehicle Type",
        color: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format distance
  const formatDistance = (value) => {
    return `${value.toFixed(1)} km`;
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-white mb-4 print:text-gray-900">
        Ride Statistics by Vehicle Type
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-64"
        >
          <Bar data={chartData} options={options} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300 print:text-gray-800">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400 print:bg-gray-100 print:text-gray-700">
                <tr>
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Rides</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Avg. Fare</th>
                  <th className="px-4 py-3">Avg. Distance</th>
                </tr>
              </thead>
              <tbody>
                {vehicleTypes.map((type, index) => {
                  const rides = data.vehicleStats.rides[type]?.count || 0;
                  const revenue = data.vehicleStats.rides[type]?.totalFare || 0;
                  const distance = data.vehicleStats.rides[type]?.totalDistance || 0;
                  const avgFare = rides > 0 ? revenue / rides : 0;
                  const avgDistance = rides > 0 ? distance / rides : 0;

                  return (
                    <tr
                      key={type}
                      className="border-b border-gray-700 print:border-gray-200"
                    >
                      <td className="px-4 py-3 font-medium">{vehicleLabels[index]}</td>
                      <td className="px-4 py-3">{rides}</td>
                      <td className="px-4 py-3">{formatCurrency(revenue)}</td>
                      <td className="px-4 py-3">{formatDistance(distance)}</td>
                      <td className="px-4 py-3">{formatCurrency(avgFare)}</td>
                      <td className="px-4 py-3">{formatDistance(avgDistance)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-700 font-medium print:bg-gray-100">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">{data.totalRides || 0}</td>
                  <td className="px-4 py-3">{formatCurrency(data.totalRevenue || 0)}</td>
                  <td className="px-4 py-3">{formatDistance(data.totalDistance || 0)}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(
                      data.completedRides > 0
                        ? (data.totalRevenue || 0) / (data.completedRides || 1)
                        : 0
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatDistance(
                      data.completedRides > 0
                        ? (data.totalDistance || 0) / (data.completedRides || 1)
                        : 0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideStatsChart;
