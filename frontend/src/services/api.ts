import axios from "axios";

const API_URL = "http://localhost:5000/api"; // we need to add this in .env but currently hardcoding for simplicity


export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status === 500) return "Server error. Please try again later.";
    if (error.code === "ERR_NETWORK") return "Network error. Please check your connection.";
    return error.message || "An error occurred.";
  }
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export const fetchResources = async (
  q: string = "",
  resourceType: string = "",
  difficulty: string = "",
  tag: string = "",
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/resources`, {
      params: { q, resourceType, difficulty, tag, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new Error(getErrorMessage(error));
  }
};

export const getAIRecommendations = async (goal: string, maxItems: number) => {
  try {
    const response = await axios.post(`${API_URL}/ai/recommend-path`, { goal, maxItems });
    return response.data;
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    throw new Error(getErrorMessage(error));
  }
};

export const fetchResourceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resource:", error);
    throw new Error(getErrorMessage(error));
  }
};