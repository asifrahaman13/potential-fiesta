function speakerConfig() {
  try {
    const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
    const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;
    return { SPEECH_KEY, SPEECH_REGION };
  } catch (e) {
    console.log(e);
  }
}


function ServerConfig() {
  try {
    const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const SERVER_SOCKET= process.env.NEXT_PUBLIC_BACKEND_SOCKET;
    return { SERVER_URL, SERVER_SOCKET };
  } catch (e) {
    console.log(e);
  }
}

function ClientConfig() {
  try {
    const CLIENT_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    return { CLIENT_URL };
  } catch (e) {
    console.log(e);
  }
}

export { speakerConfig, ServerConfig , ClientConfig};

