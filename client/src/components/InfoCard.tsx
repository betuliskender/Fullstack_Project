import React from "react";
import CardContainer from "./CardContainer";
import { Text } from "@chakra-ui/react";

interface InfoCardProps {
  title: string;
  details: { [key: string]: string | number };
  description: string;
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, details, description, onClick }) => {
  return (
    <CardContainer
      title={title}
      actions={
        onClick && (
          <Text
            color="blue.500"
            cursor="pointer"
            fontWeight="semibold"
            onClick={onClick}
          >
            View Details
          </Text>
        )
      }
    >
      {Object.entries(details).map(([key, value]) => (
        <Text key={key} mb={2}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
        </Text>
      ))}
      <Text>
        <strong>Description:</strong>{" "}
        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
      </Text>
    </CardContainer>
  );
};

export default InfoCard;
