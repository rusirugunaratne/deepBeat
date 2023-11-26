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

  // Use local storage to store values and predictions
  const storedData = JSON.parse(localStorage.getItem("predictionData") || "[]")
  const [predictionData, setPredictionData] = useState(storedData)

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

        const newData = {
          values: numericValues,
          prediction: roundedPredictionValue,
          timestamp: Date.now(),
        }
        const newPredictionData = [...predictionData, newData]
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

  const handleExport = () => {
    // Log all saved data
    setPlotDialogOpen(true)
    console.log("All Saved Data:", predictionData)
  }

  console.log("values", values)

  return (
    <>
      <PredictionPlot predictionData={predictionData} />
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
            <IconButton color='success' aria-label='delete'>
              <DeleteIcon />
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
            width={650}
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={2}
          >
            <PredictionPlot predictionData={predictionData} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            startIcon={<GetAppIcon />}
            onClick={handlePlotDialogClose}
            color='primary'
          >
            Export
          </Button>
          <Button onClick={handlePlotDialogClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Prediction
