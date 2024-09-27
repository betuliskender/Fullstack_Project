import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    characters: [Character]
  }

  type Character {
    id: ID!
    name: String!
    level: Int!
    race: String!
    class: String!
    background: String!
    imageURL: String!
    attributes: Attributes
    user: User
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
    id: ID!
    name: String!
    description: String!
    characters: [Character]
    sessions: [Session]
  }

  type CampaignCharacter {
    id: ID!
    campaign: Campaign!
    character: Character!
  }

  type Session {
    id: ID!
    sessionDate: String!
    logEntry: String!
    campaign: Campaign!
  }

  # Query type for fetching data
  type Query {
    users: [User]
    user(id: ID!): User

    characters: [Character]
    character(id: ID!): Character

    campaigns: [Campaign]
    campaign(id: ID!): Campaign

    sessions: [Session]
    session(id: ID!): Session
  }

  type Mutation {
    registerUser(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User

    login(email: String!, password: String!): String

    createCharacter(
      name: String!
      level: Int!
      race: String!
      class: String!
      background: String!
      imageURL: String!
      userId: ID!
      attributes: AttributesInput!
    ): Character

    editCharacter(
      id: ID!
      name: String
      level: Int
      race: String
      class: String
      background: String
      imageURL: String
      attributes: AttributesInput
    ): Character

    deleteCharacter(id: ID!): Character

    createCampaign(name: String!, description: String!): Campaign

    editCampaign(id: ID!, name: String, description: String): Campaign

    deleteCampaign(id: ID!): Campaign

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
      sessionDate: String
      logEntry: String!
    ): Session

    editSession(id: ID!, sessionDate: String, logEntry: String): Session

    deleteSession(id: ID!): Session
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
