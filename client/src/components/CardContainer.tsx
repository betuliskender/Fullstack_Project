import React, { ReactNode } from "react";
import { Card, CardHeader, CardBody, Box } from "@chakra-ui/react";

interface CardContainerProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ title, children, actions }) => {
  return (
    <Card>
      <CardHeader>
        <Box as="h2" fontSize="lg" fontWeight="bold">
          {title}
        </Box>
      </CardHeader>
      <CardBody>{children}</CardBody>
      {actions && <Box p={3}>{actions}</Box>}
    </Card>
  );
};

export default CardContainer;
