import React from "react"
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_RowData,
  createMRTColumnHelper,
} from "material-react-table"
import { Box, Button } from "@mui/material"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import logo from "../../assets/deep_beat_logo.png"

interface TransformedPredictionData {
  timestamp: number
  prediction: string
  duration_ms: number
  key: number
  mode: number
  time_signature: number
  track_genre_1: number
}

const columnHelper = createMRTColumnHelper<TransformedPredictionData>()

const columns = [
  columnHelper.accessor("timestamp", {
    header: "Timestamp",
    size: 120,
  }),
  columnHelper.accessor("prediction", {
    header: "Prediction",
    size: 40,
  }),
  columnHelper.accessor("duration_ms", {
    header: "DurationMS",
    size: 40,
  }),
  columnHelper.accessor("key", {
    header: "Key",
    size: 40,
  }),
  columnHelper.accessor("mode", {
    header: "Mode",
    size: 40,
  }),
  columnHelper.accessor("time_signature", {
    header: "TS",
    size: 40,
  }),
  columnHelper.accessor("track_genre_1", {
    header: "Genre",
    size: 40,
  }),
  // Add other feature columns here
]

interface PredictionTableProps {
  predictionData: TransformedPredictionData[]
}

const PredictionTable: React.FC<PredictionTableProps> = ({
  predictionData,
}) => {
  const handleExportRows = (rows: MRT_Row<TransformedPredictionData>[]) => {
    const doc = new jsPDF()
    const tableData = rows.map((row) => Object.values(row.original))
    const tableHeaders = columns.map((c) => c.header)
    console.log("table headers", tableHeaders)

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    })

    doc.addImage(logo, "PNG", 170, 100, 40, 40)

    doc.save("DeepBeat Predictions.pdf")
  }

  const table = useMaterialReactTable({
    columns,
    data: predictionData,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  })

  return <MaterialReactTable table={table} />
}

export default PredictionTable
