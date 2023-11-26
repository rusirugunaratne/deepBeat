import React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
interface PredictionData {
  prediction: string
  timestamp: number
  values: Record<string, number>
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
interface PredictionPlotProps {
  predictionData: PredictionData[]
}

const PredictionPlot: React.FC<PredictionPlotProps> = ({ predictionData }) => {
  const labels = predictionData.map((entry, index) => index)
  const predictions = predictionData.map((entry) =>
    parseFloat(entry.prediction)
  )

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Prediction",
        data: predictions,
        fill: false,
        borderWidth: 4,
        backgroundColor: "#46b989",
        borderColor: "#46b989",
        tension: 0.4,
      },
    ],
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex
            const currentData = predictionData[index]

            return Object.entries(currentData.values)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          },
        },
      },
    },
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line options={options} data={data} />
    </div>
  )
}

export default PredictionPlot
