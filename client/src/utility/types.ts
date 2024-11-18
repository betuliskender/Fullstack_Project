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
  sessions: Session[];
  maps?: Map[];
}

export interface Session {
  _id?: string;
  sessionDate: string;
  logEntry: string;
  campaign: string;
}

export interface Map {
  _id?: string;
  pinLocation?: string;
  imageURL: string;
  campaign: string;
  session?: string;
  pins?: {
    _id?: string;
    x: number;
    y: number;
    character?: {
      _id: string;
      name?: string;
      imageURL?: string;
    };
  }[];
}