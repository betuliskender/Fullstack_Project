import {
  Character,
  User,
  LoginUser,
  LoginResponse,
  Campaign,
  Map,
} from "./types";
import axiosInstance from "./axiosInstance";

export const createCharacter = async (character: Character, token: string) => {
  const response = await axiosInstance.post("/characters", character, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
    retryDelay: 1000,
  });
  return response.data;
};

export const deleteCharacter = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/characters/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
  });
  return response.data;
};

export const editCharacter = async (
  id: string,
  characterData: Character,
  token: string
): Promise<Character> => {
  const response = await axiosInstance.put(`/characters/${id}`, characterData, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
  });
  return response.data;
};

export const registerUser = async (
  userData: User
): Promise<{ message: string }> => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (
  credentials: LoginUser
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/users/login", credentials);
  return response.data;
};

export const updateUser = async (
  userData: FormData,
  token: string
): Promise<User> => {
  const response = await axiosInstance.put("/users/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.user;
};


export const createCampaign = async (
  campaign: Campaign,
  token: string
): Promise<Campaign> => {
  const response = await axiosInstance.post("/campaigns", campaign, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
  });
  return response.data;
};

export const deleteCampaign = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/campaigns/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
  });
  return response.data;
};

export const editCampaign = async (
  id: string,
  campaignData: Campaign,
  token: string
): Promise<Campaign> => {
  const response = await axiosInstance.put(`/campaigns/${id}`, campaignData, {
    headers: { Authorization: `Bearer ${token}` },
    retry: 3,
  });
  return response.data;
};

export const addCharacterToCampaign = async (
  campaignId: string,
  characterId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/campaigns/${campaignId}/characters`,
    { characterId },
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const changeCharacterInCampaign = async (
  campaignId: string,
  characterId: string,
  newCharacterId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(
    `/campaigns/${campaignId}/characters/${characterId}`,
    { newCharacterId },
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const removeCharacterFromCampaign = async (
  campaignId: string,
  characterId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/campaigns/${campaignId}/characters/${characterId}`,
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const createSession = async (
  campaignId: string,
  sessionData: { title: string; sessionDate: string; logEntry: string },
  token: string
) => {
  const response = await axiosInstance.post(
    `/campaigns/${campaignId}/sessions`,
    sessionData,
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const editSession = async (
  campaignId: string,
  sessionId: string,
  sessionData: { title: string; sessionDate: string; logEntry: string },
  token: string
) => {
  const response = await axiosInstance.put(
    `/campaigns/${campaignId}/sessions/${sessionId}`,
    sessionData,
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const deleteSession = async (
  campaignId: string,
  sessionId: string,
  token: string
) => {
  const response = await axiosInstance.delete(
    `/campaigns/${campaignId}/sessions/${sessionId}`,
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const uploadMapToCampaign = async (
  campaignId: string,
  file: File,
  token: string
): Promise<Map> => {
  const formData = new FormData();
  formData.append("mapImage", file);

  const response = await axiosInstance.post(
    `/campaigns/${campaignId}/upload-map`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const addPinToMap = async (
  campaignId: string,
  mapId: string,
  x: number,
  y: number,
  token: string,
  characterId?: string
): Promise<{ pins: Map["pins"] }> => {
  const response = await axiosInstance.post(
    `/campaigns/${campaignId}/maps/${mapId}/pins`,
    { x, y, characterId },
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

// get all skills
export const getSkills = async () => {
  const response = await axiosInstance.get("/skills");
  return response.data;
};

// get all spells
export const getSpells = async () => {
  const response = await axiosInstance.get("/spells");
  return response.data;
};

export const addSpellsToCharacter = async (
  characterId: string,
  spells: { name: string }[],
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/characters/${characterId}/spells`,
    { spells },
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const addSkillsToCharacter = async (
  characterId: string,
  skills: { name: string }[],
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/characters/${characterId}/skills`,
    { skills },
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};

export const deleteMapFromCampaign = async (
  campaignId: string,
  mapId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/campaigns/${campaignId}/maps/${mapId}`,
    { headers: { Authorization: `Bearer ${token}` }, retry: 3 }
  );
  return response.data;
};
