import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    profileImage: String
    characters: [Character]
  }

  type Skill {
    _id: ID!
    name: String!
    level: Int
    desc: String
    abilityScore: String
  }

  type Spell {
    _id: ID!
    name: String!
    level: Int!
    description: String!
    damage: Int
    duration: String
  }

  type Character {
    _id: ID!
    name: String!
    level: Int!
    race: Race!
    class: Class!
    background: String!
    imageURL: String!
    attributes: Attributes
    user: User
  }

  type Race {
    name: String!
    traits: [String]
    languages: [String]
  }
  
  type Class {
    name: String!
    proficiencies: [String]
    starting_equipment: [String]
  }

  type Attributes {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }

  type Campaign {
    _id: ID!
    name: String!
    description: String!
    characters: [Character]
    sessions: [Session]
    maps: [Map]
  }

  type Pin {
    x: Float!
    y: Float!
    character: Character
  }

  type Map {
    _id: ID!
    pinLocation: String
    imageURL: String!
    campaign: Campaign!
    session: Session
    pins: [Pin]
  }

  type CampaignCharacter {
    _id: ID!
    campaign: Campaign!
    character: Character!
  }

  type Session {
    _id: ID!
    title: String!
    sessionDate: String!
    logEntry: String!
    campaign: Campaign!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  # Query type for fetching data
  type Query {
    users: [User]
    user(_id: ID!): User

    characters: [Character]
    character(_id: ID!): Character

    campaigns: [Campaign]
    campaign(_id: ID!): Campaign

    sessions: [Session]
    session(_id: ID!): Session

    maps: [Map]
    map(_id: ID!): Map
    spells: [Spell]
    spell(_id: ID!): Spell

    skills: [Skill]
    skill(_id: ID!): Skill
  }

  type Mutation {
    registerUser(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User

    login(email: String!, password: String!): LoginResponse!

    createCharacter(
      name: String!
      level: Int!
      race: RaceInput!
      class: ClassInput!
      background: String!
      imageURL: String!
      userId: ID!
      attributes: AttributesInput!
    ): Character

    editCharacter(
      _id: ID!
      name: String
      level: Int
      race: String
      class: String
      background: String
      imageURL: String
      attributes: AttributesInput
    ): Character

    deleteCharacter(_id: ID!): Character

    createCampaign(name: String!, description: String!): Campaign

    editCampaign(_id: ID!, name: String, description: String): Campaign

    deleteCampaign(_id: ID!): Campaign

    addCharacterToCampaign(campaignId: ID!, characterId: ID!): CampaignCharacter

    changeCharacterInCampaign(
      campaignId: ID!
      characterId: ID!
      newCharacterId: ID!
    ): CampaignCharacter

    removeCharacterFromCampaign(
      campaignId: ID!
      characterId: ID!
    ): CampaignCharacter

    createSession(
      campaignId: ID!
      title: String!
      sessionDate: String
      logEntry: String!
    ): Session

    editSession(_id: ID!, title: String, sessionDate: String, logEntry: String): Session

    deleteSession(_id: ID!): Session

    addPinToMap(mapId: ID!, x: Float!, y: Float!, characterId: ID): Map

    updateUserProfile(
    firstName: String
    lastName: String
    email: String
    profileImage: String
  ): User
  }
  
  input RaceInput {
    name: String!
    traits: [String]
    languages: [String]
  }
  
  input ClassInput {
    name: String!
    proficiencies: [String]
    starting_equipment: [String]
  }

  input AttributesInput {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }
`;
