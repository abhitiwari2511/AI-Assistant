import axios from "axios";

const getAiResponse = async (prompt: string) => {
  try {
    const url = import.meta.env.VITE_BACKEND_URL;
    const endPoints = `${url}/api/v1/users/askAssistant`;

    const result = await axios.post(
      endPoints,
      { prompt },
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export default getAiResponse;
