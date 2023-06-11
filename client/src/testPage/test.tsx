declare const responsiveVoice: any;
import { BlueButton } from "../components/buttons";
import { AudioRecorder } from "../dialoguePage/speechToText/audioRecorder";
import { trpc } from "../providers/trpc";

const audioRecorder = new AudioRecorder();

export function TestPage() {
  const { data, refetch, isSuccess } = trpc.user.me.useQuery(undefined, {
    enabled: false,
  });

  const handleClick = () => {
    refetch();
  };

  return (
    <div>
      <div>Test</div>
      <BlueButton
        onClick={() => {
          audioRecorder.startRecording();
        }}
      >
        Start
      </BlueButton>

      <BlueButton
        onClick={() => {
          audioRecorder.stopRecording();
        }}
      >
        End
      </BlueButton>

      <BlueButton
        onClick={() => {
          audioRecorder.playRecording();
        }}
      >
        Play
      </BlueButton>

      <BlueButton
        onClick={async () => {
          await responsiveVoice.speak("Try connecting");
          handleClick();
          if (isSuccess) console.log(data);
        }}
      >
        Test
      </BlueButton>
    </div>
  );
}