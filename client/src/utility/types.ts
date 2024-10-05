export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  _id?: string;
  name: string;
  level: number;
  race: string;
  class: string;
  background: string;
  imageURL: string;
  attributes: Attributes;
  user: string;
}

export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  jwtToken: string;
}

export interface Campaign {
  _id?: string;
  name: string;
  description: string;
  user: string;
  characters: Character[];
}
