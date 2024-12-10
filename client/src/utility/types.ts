export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CreateRace {
  name: string;
  traits: string[];
  languages: string[];
}

export interface Races {
  name: string;
}

export interface CreateClass {
  name: string;
  proficiencies: string[];
  starting_equipment: string[];
}
export interface Classes {
  name: string;
}

export interface Character {
  _id?: string;
  name: string;
  level: number;
  race: CreateRace;
  class: CreateClass;
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
  profileImage: string;
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