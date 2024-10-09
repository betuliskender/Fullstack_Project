import { gql } from "@apollo/client";

export const GETALLCHARACTERS = gql`
  query Characters {
    characters {
      _id
      name
      level
      race
      class
      background
      imageURL
      attributes {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
      }
    }
  }
`;

export const GET_ALL_CAMPAIGNS = gql`
  query GetAllCampaigns {
    campaigns {
      _id
      name
      description
    }
  }
`;

export const GET_CAMPAIGNS_WITH_CHARACTERS = gql`
  query GetCampaignsWithCharacters {
    campaigns {
      _id
      name
      description
      characters {
        _id
        name
      }
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($name: String!, $description: String!) {
    createCampaign(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      id
    }
  }
`;

export const ADD_CHARACTER_TO_CAMPAIGN = gql`
  mutation AddCharacterToCampaign($campaignId: ID!, $characterId: ID!) {
    addCharacterToCampaign(campaignId: $campaignId, characterId: $characterId) {
      _id
      name
      characters {
        _id
        name
      }
    }
  }
`;

export const GET_CAMPAIGN_BY_ID = gql`
query Query($id: ID!) {
  campaign(_id: $id) {
    _id
    name
    description
    characters {
      _id
      name
    }
    sessions {
      _id
      sessionDate
      logEntry
    }
  }
}`;

