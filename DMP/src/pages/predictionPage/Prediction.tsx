import {
  Stack,
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material"
import Chip from "@mui/material/Chip"
import deepBeatLogo from "../../assets/deep_beat_logo.png"
import TextField from "@mui/material/TextField"
import React, { useState } from "react"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { genres } from "../../consts/genres"
import useForm from "../../hooks/useForms"
import { pitches } from "../../consts/pitches"
import { timeSignatures } from "../../consts/timeSignatures"
import { ENDPOINTS, createAPIEndpoint } from "../../api/api"
import animation from "../../assets/Music (1).gif"
import GetAppIcon from "@mui/icons-material/GetApp"
import BarChartIcon from "@mui/icons-material/BarChart"
import PredictionPlot from "../PredictionPlot/PredictionPlot"
import DeleteIcon from "@mui/icons-material/Delete"
import exportToPDF from "../../utils/ExportToPdf"
import PredictionTable from "../PredictionTable/PredictionTable"
import { columns } from "../../consts/features"
import ContactSupportIcon from "@mui/icons-material/ContactSupport"

interface OriginalPredictionData {
  timestamp: number
  prediction: string
  values: {
    duration_ms: number
    key: number
    mode: number
    time_signature: number
    track_genre_1: number
  }
}

interface TransformedPredictionData {
  timestamp: number
  prediction: string
  duration_ms: number
  key: number
  mode: number
  time_signature: number
  track_genre_1: number
}

function convertToNumeric(obj: Record<string, any>): Record<string, number> {
  const result: Record<string, number> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      result[key] = typeof value === "number" ? value : parseFloat(value) || 0
      result[key] = parseFloat(value)
    }
  }

  return result
}

function Prediction() {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [plotDialogOpen, setPlotDialogOpen] = useState(false)
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false)

  // Use local storage to store values and predictions
  const storedData = JSON.parse(localStorage.getItem("predictionData") || "[]")
  const [predictionData, setPredictionData] = useState(storedData)

  const clearLocalStorage = () => {
    localStorage.removeItem("predictionData")
    setPredictionData([])
  }

  const getFreshModel = () => ({
    artists_0: 0,
    artists_1: 0,
    artists_2: 0,
    artists_3: 0,
    artists_4: 0,
    album_name_0: 0,
    album_name_1: 0,
    album_name_2: 0,
    album_name_3: 0,
    album_name_4: 0,
    track_name_1: 0,
    track_name_2: 0,
    track_name_3: 0,
    track_name_4: 0,
    duration_ms: null,
    explicit: 0,
    danceability: 0.0,
    energy: 0.0,
    key: null,
    mode: null,
    speechiness: 0.0,
    instrumentalness: 0.0,
    liveness: 0.0,
    valence: 0.0,
    tempo: null,
    time_signature: null,
    track_genre_1: null,
    speechiness_type_Low: 0,
  })

  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel)

  function valuetext(value: number) {
    return `${value}°C`
  }

  const [age, setAge] = React.useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData()

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key].toString())
      }
    }

    return formData
  }

  const predict = () => {
    const numericValues = convertToNumeric(values)
    const formData = objectToFormData(numericValues)
    createAPIEndpoint(ENDPOINTS.predict)
      .post(numericValues)
      .then((response) => {
        const rawPredictionValue = response?.data?.prediction
        const roundedPredictionValue =
          typeof rawPredictionValue === "number"
            ? rawPredictionValue.toFixed(2)
            : rawPredictionValue
        setPrediction(roundedPredictionValue)
        setDialogOpen(true)

        const featuresToInclude: Array<keyof typeof numericValues> = [
          "duration_ms",
          "explicit",
          "danceability",
          "energy",
          "key",
          "mode",
          "speechiness",
          "instrumentalness",
          "liveness",
          "valence",
          "tempo",
          "time_signature",
          "track_genre_1",
          "speechiness_type_Low",
        ]

        const newValues: Record<string, number | null> =
          featuresToInclude.reduce((acc, feature) => {
            acc[feature] = numericValues[feature]
            return acc
          }, {} as Record<string, number | null>)

        const newData: {
          values: Record<string, number | null>
          prediction: string
          timestamp: number
        } = {
          values: newValues,
          prediction: roundedPredictionValue,
          timestamp: Date.now(),
        }

        const newPredictionData: Array<{
          values: Record<string, number | null>
          prediction: string
          timestamp: number
        }> = [...predictionData, newData]

        setPredictionData(newPredictionData)
        localStorage.setItem(
          "predictionData",
          JSON.stringify(newPredictionData)
        )
      })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setPrediction(null)
  }

  const handlePlotDialogClose = () => {
    setPlotDialogOpen(false)
  }

  const handleFeatureDialogClose = () => {
    setFeatureDialogOpen(false)
  }

  const handleExport = () => {
    // Log all saved data
    setPlotDialogOpen(true)
    console.log("All Saved Data:", predictionData)
  }

  const handleExportClick = () => {
    exportToPDF(predictionData)
  }

  const transformData = (
    originalData: OriginalPredictionData[]
  ): TransformedPredictionData[] => {
    return originalData.map((originalItem) => ({
      timestamp: originalItem.timestamp,
      prediction: originalItem.prediction,
      duration_ms: originalItem.values.duration_ms,
      key: originalItem.values.key,
      mode: originalItem.values.mode,
      time_signature: originalItem.values.time_signature,
      track_genre_1: originalItem.values.track_genre_1,
    }))
  }

  console.log("values", values)

  return (
    <>
      <Stack
        height={"100%"}
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        width={"100vw"}
      >
        <img height={400} src={deepBeatLogo} alt='' />
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='flex-start'
          spacing={1}
        >
          <TextField id='outlined-basic' label='Artist' variant='outlined' />
          <TextField
            id='outlined-basic'
            label='Album Name'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            label='Track Name'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            label='Duration in milliseconds'
            value={values.duration_ms}
            onChange={handleInputChange}
            name='duration_ms'
            type='number'
            variant='outlined'
          />

          <FormControlLabel
            control={
              <Checkbox
                value={values.duration_ms}
                onChange={(e) => {
                  setValues({ ...values, explicit: e.target.checked ? 1 : 0 })
                }}
                defaultChecked
              />
            }
            label='Explicit'
          />

          <Typography id='input-slider' gutterBottom>
            Danceability
          </Typography>

          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            // getAriaValueText={valuetext}
            value={values.danceability}
            onChange={handleInputChange}
            name='danceability'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />

          <Typography id='input-slider' gutterBottom>
            Energy
          </Typography>

          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            // getAriaValueText={valuetext}
            value={values.energy}
            onChange={handleInputChange}
            name='energy'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />

          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Key</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='Key'
              value={values.key}
              onChange={handleInputChange}
              name='key'
            >
              {pitches.map((pitch, index) => {
                return <MenuItem value={index}>{pitch}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Stack>
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='flex-start'
          spacing={1}
        >
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Mode</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='Mode'
              value={values.mode}
              onChange={handleInputChange}
              name='mode'
            >
              <MenuItem value={1}>Major</MenuItem>
              <MenuItem value={0}>Minor</MenuItem>
            </Select>
          </FormControl>
          <Typography id='input-slider' gutterBottom>
            Speechiness
          </Typography>
          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            // getAriaValueText={valuetext}
            value={values.speechiness}
            onChange={handleInputChange}
            name='speechiness'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />
          <Typography id='input-slider' gutterBottom>
            Instrumentalness
          </Typography>
          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            value={values.instrumentalness}
            onChange={handleInputChange}
            name='instrumentalness'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />
          <Typography id='input-slider' gutterBottom>
            Liveness
          </Typography>
          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            value={values.liveness}
            onChange={handleInputChange}
            name='liveness'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />

          <Typography id='input-slider' gutterBottom>
            Valence
          </Typography>
          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            value={values.valence}
            onChange={handleInputChange}
            name='valence'
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />
          <TextField
            id='outlined-basic'
            label='Tempo (BPM)'
            variant='outlined'
            value={values.tempo}
            onChange={handleInputChange}
            name='tempo'
          />
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Time Signature
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              // value={age}
              label='Time Signature'
              value={values.time_signature}
              onChange={handleInputChange}
              name='time_signature'
            >
              {timeSignatures.map(({ value, displayText }) => {
                return <MenuItem value={value}>{displayText}</MenuItem>
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Genre</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              // value={age}
              label='Genre'
              value={values.track_genre_1}
              onChange={handleInputChange}
              name='track_genre_1'
            >
              {genres.map((genre, index) => {
                return <MenuItem value={index}>{genre}</MenuItem>
              })}
            </Select>
          </FormControl>

          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='center'
            spacing={1}
          >
            <Button
              onClick={() => predict()}
              endIcon={<ArrowForwardIosIcon />}
              variant='contained'
            >
              Predict
            </Button>
            <Button
              onClick={() => handleExport()}
              startIcon={<BarChartIcon />}
              variant='contained'
            >
              ({predictionData.length})
            </Button>
            <IconButton
              onClick={clearLocalStorage}
              color='success'
              aria-label='delete'
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              onClick={() => setFeatureDialogOpen(true)}
              color='success'
              aria-label='delete'
            >
              <ContactSupportIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Predicted Popularity</DialogTitle>
        <DialogContent>
          <Stack
            margin={2}
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <img height={400} src={animation} alt='' />
            <Typography variant='h2'>{prediction}%</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth='lg'
        open={plotDialogOpen}
        onClose={handlePlotDialogClose}
      >
        <DialogTitle>Predicted Popularity</DialogTitle>
        <DialogContent style={{ width: "100%", maxWidth: "none" }}>
          <Stack
            // width={650}
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={2}
          >
            <PredictionPlot predictionData={predictionData} />
            <PredictionTable predictionData={transformData(predictionData)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePlotDialogClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth='lg'
        open={featureDialogOpen}
        onClose={handleFeatureDialogClose}
      >
        <DialogTitle>Feature Details</DialogTitle>
        <DialogContent style={{ width: "100%", maxWidth: "none" }}>
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='flex-start'
            spacing={5}
          >
            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={2}
            >
              {columns.map((column) => {
                return (
                  <>
                    <Chip
                      color='success'
                      label={column.title}
                      variant='outlined'
                    />
                    <Typography>{column.text}</Typography>
                  </>
                )
              })}
            </Stack>

            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={2}
            >
              <Typography variant='h5'>Pitches</Typography>
              {pitches.map((pitch, index) => {
                return (
                  <>
                    <Stack
                      direction='row'
                      justifyContent='flex-start'
                      alignItems='center'
                      spacing={2}
                    >
                      <Chip color='success' label={index} variant='outlined' />
                      <Typography>{pitch}</Typography>
                    </Stack>
                  </>
                )
              })}
            </Stack>

            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={2}
            >
              <Typography variant='h5'>Genres</Typography>
              {genres.map((pitch, index) => {
                return (
                  <>
                    <Stack
                      direction='row'
                      justifyContent='flex-start'
                      alignItems='center'
                      spacing={2}
                    >
                      <Chip color='success' label={index} variant='outlined' />
                      <Typography>{pitch}</Typography>
                    </Stack>
                  </>
                )
              })}
            </Stack>

            <Stack
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={2}
            >
              <Typography variant='h5'>Time Signatures</Typography>
              {timeSignatures.map((pitch, index) => {
                return (
                  <>
                    <Stack
                      direction='row'
                      justifyContent='flex-start'
                      alignItems='center'
                      spacing={2}
                    >
                      <Chip
                        color='success'
                        label={pitch.value}
                        variant='outlined'
                      />
                      <Typography>{pitch.displayText}</Typography>
                    </Stack>
                  </>
                )
              })}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeatureDialogClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Prediction
