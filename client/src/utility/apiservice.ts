import axios from "axios";
import { Character, User, LoginUser, LoginResponse } from "./types";

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

export const deleteCharacter = async (id: string, token: string): Promise<{ message: string }> => {
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

export const editCharacter = async (id: string, characterData: Character, token: string): Promise<Character> => {
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

export const registerUser = async (userData: User): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`${API_URL}/users/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: LoginUser): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/users/login`, credentials);
    console.log("Response data:", response.data); // Log the response data
    return response.data; // Ensure the response contains the token and message
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed");
  }
};