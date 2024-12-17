import React from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Box mt={4}>
      <ButtonGroup>
        <Button isDisabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "solid" : "outline"}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Pagination;
