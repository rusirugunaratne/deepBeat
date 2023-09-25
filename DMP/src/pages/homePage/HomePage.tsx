import { Button, Stack, Typography } from "@mui/material";
import deepBeatLogo from "../../assets/deep_beat_logo.png";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function HomePage() {
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
          //   spacing={1}
        >
          <Button
            sx={{ fontSize: 50, borderRadius: 10 }}
            endIcon={<ArrowForwardIcon fontSize='large' />}
          >
            Predict
          </Button>
          {/* <Button startIcon={<HelpOutlineIcon />}>Learn More</Button> */}
          <Typography>A Song Popularity Prediction System</Typography>
        </Stack>
      </Stack>
    </>
  );
}

export default HomePage;
