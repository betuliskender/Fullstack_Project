import axios from "axios";
import {
  Character,
  User,
  LoginUser,
  LoginResponse,
  Campaign,
  Map,
} from "./types";

const API_URL = "http://localhost:5000/api";

export const createCharacter = async (character: Character, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/characters`, character, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating character:", error);
    throw error;
  }
};

export const deleteCharacter = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/characters/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting character:", error);
    throw error;
  }
};

export const editCharacter = async (
  id: string,
  characterData: Character,
  token: string
): Promise<Character> => {
  try {
    const response = await axios.put<Character>(
      `${API_URL}/characters/${id}`,
      characterData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing character:", error);
    throw error;
  }
};

export const registerUser = async (
  userData: User
): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${API_URL}/users/register`,
    userData
  );
  return response.data;
};

export const loginUser = async (
  credentials: LoginUser
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/users/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed");
  }
};

export const updateUser = async (
  userData: FormData,
  token: string
): Promise<User> => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};


export const createCampaign = async (
  campaign: Campaign,
  token: string
): Promise<Campaign> => {
  try {
    const response = await axios.post(`${API_URL}/campaigns`, campaign, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const deleteCampaign = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/campaigns/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};

export const editCampaign = async (
  id: string,
  campaignData: Campaign,
  token: string
): Promise<Campaign> => {
  try {
    const response = await axios.put<Campaign>(
      `${API_URL}/campaigns/${id}`,
      campaignData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing campaign:", error);
    throw error;
  }
};

export const addCharacterToCampaign = async (
  campaignId: string,
  characterId: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/characters`,
      { characterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding character to campaign:", error);
    throw error;
  }
};

export const changeCharacterInCampaign = async (
  campaignId: string,
  characterId: string,
  newCharacterId: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.put(
      `${API_URL}/campaigns/${campaignId}/characters/${characterId}`,
      { newCharacterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing character in campaign:", error);
    throw error;
  }
};

export const removeCharacterFromCampaign = async (
  campaignId: string,
  characterId: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/characters/${characterId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing character from campaign:", error);
    throw error;
  }
};

export const createSession = async (
  campaignId: string,
  sessionData: { sessionDate: string; logEntry: string },
  token: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/sessions`,
      sessionData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const editSession = async (
  campaignId: string,
  sessionId: string,
  sessionData: { sessionDate: string; logEntry: string },
  token: string
) => {
  try {
    const response = await axios.put(
      `${API_URL}/campaigns/${campaignId}/sessions/${sessionId}`,
      sessionData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing session:", error);
    throw error;
  }
};

export const deleteSession = async (
  campaignId: string,
  sessionId: string,
  token: string
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/campaigns/${campaignId}/sessions/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

export const uploadMapToCampaign = async (
  campaignId: string,
  file: File,
  token: string
): Promise<Map> => {
  const formData = new FormData();
  formData.append("mapImage", file);

  try {
    const response = await axios.post<Map>(
      `${API_URL}/campaigns/${campaignId}/upload-map`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading map:", error);
    throw error;
  }
};
export const addPinToMap = async (
  campaignId: string,
  mapId: string,
  x: number,
  y: number,
  token: string,
  characterId?: string
): Promise<{ pins: Map["pins"] }> => {
  try {
    const response = await axios.post(
      `${API_URL}/campaigns/${campaignId}/maps/${mapId}/pins`,
      { x, y, characterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding pin to map:", error);
    throw error;
  }
};

// get all skills
export const getSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/skills`);
    return response.data;
  } catch (error) {
    console.error("Error getting skills:", error);
    throw error;
  }
};

// get all spells
export const getSpells = async () => {
  try {
    const response = await axios.get(`${API_URL}/spells`);
    return response.data;
  } catch (error) {
    console.error("Error getting spells:", error);
    throw error;
  }
};

export const addSpellsToCharacter = async (
  characterId: string,
  spells: { name: string }[],
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/characters/${characterId}/spells`,
      { spells }, // Send spell data as expected by the backend
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token for authentication
        },
      }
    );
    return response.data; // Return response data from the server
  } catch (error) {
    console.error("Error adding spells to character:", error);
    throw error;
  }
};
