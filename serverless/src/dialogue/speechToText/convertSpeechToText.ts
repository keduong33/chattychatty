import axios, { AxiosError } from "axios";

export type ApiResponse = {
  status: number;
  content: string;
};

export async function convertSpeechToText(
  speechData: string,
  language: string
) {
  const model = "openai/whisper-tiny";
  const data = base64ToArrayBuffer(speechData);
  const response = await sendAudioToAPI(model, data);
  return response;
}

async function sendAudioToAPI(
  model: string,
  data: ArrayBuffer
): Promise<ApiResponse> {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      data,
      {
        timeout: 9000,
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );
    return { status: 200, content: response.data["text"] };
  } catch (e) {
    console.error(e);
    const error = e as AxiosError;
    return {
      status: error.response?.status ?? 500,
      content: error.response?.statusText ?? "",
    };
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
