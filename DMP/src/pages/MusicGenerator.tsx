import React, { useState } from "react"
import * as Tone from "tone"

export const Metronome: React.FC = () => {
  const [tempo, setTempo] = useState<number>(120)
  const [timeSignature, setTimeSignature] = useState<string>("4/4")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const startMetronome = () => {
    Tone.Transport.bpm.value = tempo

    // Define the time signature
    const [beatsPerMeasure] = timeSignature.split("/").map(Number)

    // Create a Tone.js Loop to play the metronome
    const metronomeLoop = new Tone.Loop((time) => {
      // Trigger the metronome sound
      Tone.Draw.schedule(() => {
        // Play a click sound (you can customize this sound)
        const click = new Tone.Player(
          "path/to/metronome-click.wav"
        ).toDestination()
        click.start()

        // Log the timestamp for visualizing timing (optional)
        console.log(time)
      }, time)
    }, `1m/${beatsPerMeasure}`).start(0)

    // Start the Tone.js Transport
    Tone.Transport.start()
    setIsPlaying(true)
  }

  const stopMetronome = () => {
    // Stop the Tone.js Transport and clear scheduled events
    Tone.Transport.stop()
    Tone.Transport.cancel()
    setIsPlaying(false)
  }

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value, 10)
    setTempo(newTempo)
  }

  const handleTimeSignatureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTimeSignature = e.target.value
    setTimeSignature(newTimeSignature)
  }

  return (
    <div>
      <h1>Metronome</h1>
      <label>
        Tempo:
        <input type='number' value={tempo} onChange={handleTempoChange} />
      </label>
      <br />
      <label>
        Time Signature:
        <input
          type='text'
          value={timeSignature}
          onChange={handleTimeSignatureChange}
        />
      </label>
      <br />
      <button onClick={isPlaying ? stopMetronome : startMetronome}>
        {isPlaying ? "Stop" : "Start"}
      </button>
      <br />
    </div>
  )
}
