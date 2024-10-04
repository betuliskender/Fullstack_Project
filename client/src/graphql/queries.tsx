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
