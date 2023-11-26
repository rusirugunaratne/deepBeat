import jsPDF from "jspdf"

interface PredictionData {
  prediction: string
  timestamp: number
  values: Record<string, any>
}

const exportToPDF = (predictionData: PredictionData[]) => {
  const pdf = new jsPDF()

  pdf.text("Predicted Popularity Data", 10, 10)
  pdf.text("Timestamp\t\tPrediction", 10, 20)

  predictionData.forEach((data, index) => {
    const baseVerticalPosition = 30 + index * 60

    pdf.text(
      `${data.timestamp}\t\t${data.prediction}`,
      10,
      baseVerticalPosition
    )

    // Add a separator line
    pdf.text("-------------------------------", 10, baseVerticalPosition + 5)

    // Add table header
    pdf.text("Key\t\tValue", 10, baseVerticalPosition + 15)

    // Add values in a table format
    Object.entries(data.values).forEach(([key, value], i) => {
      const tableRow = `${key}:\t${JSON.stringify(value)}`
      pdf.text(tableRow, 10, baseVerticalPosition + 25 + i * 10)
    })

    // Add a separator line
    pdf.text(
      "-------------------------------",
      10,
      baseVerticalPosition + 25 + Object.keys(data.values).length * 10 + 5
    )
  })

  pdf.save("predicted_popularity_data.pdf")
}

export default exportToPDF
