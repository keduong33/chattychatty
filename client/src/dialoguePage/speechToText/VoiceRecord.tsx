import { useState } from "react";
import { BlueButton } from "../../components/buttons";
import { trpc } from "../../providers/trpc";
import { AudioRecorder } from "./AudioRecorder";
import { z } from "zod";
import { create } from "zustand";

const audioRecorder = new AudioRecorder();

interface TranscriptState {
  transcript: string;
  setTranscript: (newReply: string) => void;
}

export const useReplyState = create<TranscriptState>()((set) => ({
  transcript: "",
  setTranscript(newTranscript) {
    set(() => ({ transcript: newTranscript }));
  },
}));

export const VoiceRecord = () => {
  const [setTranscript] = useReplyState((state) => [state.setTranscript]);

  const { mutate: submitVoiceRecording } =
    trpc.speechToText.submitVoiceRecording.useMutation();
  const [disabledStopButton, setDisabledStopButton] = useState(true);

  function handleStartRecordingButtonClick() {
    setDisabledStopButton(false);
    audioRecorder.startRecording();
  }

  async function handleStopRecordingButtonClick() {
    setDisabledStopButton(true);
    audioRecorder.stopRecording();

    await new Promise((f) => setTimeout(f, 1000));
    const speech = await audioRecorder.getSpeech();

    if (speech) {
      submitVoiceRecording(
        { speechData: speech, language: "English" },
        {
          onSuccess: (transcript) => {
            if (transcript) {
              setTranscript(transcript);
            }
          },
          onError: (error) => {
            console.error(error);
          },
        }
      );
    } else {
      console.error("No speech found");
    }
  }

  return (
    <div title="Voice Record">
      <button
        className="focus:shadow-outline mx-4 max-h-fit max-w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        type="button"
        onClick={handleStartRecordingButtonClick}
      >
        Record
      </button>
      <BlueButton
        disabled={disabledStopButton}
        onClick={handleStopRecordingButtonClick}
      >
        Stop
      </BlueButton>
    </div>
  );
};