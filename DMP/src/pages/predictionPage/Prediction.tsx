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
} from "@mui/material";
import deepBeatLogo from "../../assets/deep_beat_logo.png";
import TextField from "@mui/material/TextField";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Prediction() {
  function valuetext(value: number) {
    return `${value}°C`;
  }

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

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
            variant='outlined'
          />

          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label='Explicit'
          />

          <Typography id='input-slider' gutterBottom>
            Danceability
          </Typography>

          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            getAriaValueText={valuetext}
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
            getAriaValueText={valuetext}
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
              value={age}
              label='Key'
              onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
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
              value={age}
              label='Key'
              onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <Typography id='input-slider' gutterBottom>
            Speechiness
          </Typography>
          <Slider
            aria-label='Small steps'
            defaultValue={0.5}
            getAriaValueText={valuetext}
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
            getAriaValueText={valuetext}
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
            getAriaValueText={valuetext}
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
            getAriaValueText={valuetext}
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay='auto'
          />
          <TextField id='outlined-basic' label='Tempo' variant='outlined' />
          <TextField
            id='outlined-basic'
            label='Time Signature'
            variant='outlined'
          />
          <TextField id='outlined-basic' label='Genre' variant='outlined' />
          <Button endIcon={<ArrowForwardIosIcon />} variant='contained'>
            Predict
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default Prediction;
