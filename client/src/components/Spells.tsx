import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import SpellGrid from "./SpellGrid";
import Pagination from "./Pagination";
import { getSpells } from "../utility/apiservice";
import { APISpell } from "../utility/types";

const Spells: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]); // Unikke klassenavne
  const [allSpells, setAllSpells] = useState<APISpell[]>([]); // Hent alle spells
  const [filteredSpells, setFilteredSpells] = useState<APISpell[]>([]); // Filtrerede spells
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSpell, setSelectedSpell] = useState<APISpell | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const spellsPerPage = 20;

  
  // Hent alle spells og udtræk klassenavne
  useEffect(() => {
    const fetchAllSpells = async () => {
      setLoading(true);
      try {
        console.log("Fetching spells...");
        const data = await getSpells(1, 20); // Henter alle spells med høj limit
        console.log("All spells fetched:", data.spells);
        
        setAllSpells(data.spells);
        
        // Udtræk unikke klassenavne
        const classSet = new Set<string>();
        data.spells.forEach((spell: APISpell) => {
          console.log("Spell classes:", spell.classes); // Debug log
          
          spell.classes?.forEach((className: string) => {
            console.log("Class name:", className); // Log hver class
            classSet.add(className); // Tilføj className direkte til sættet
          });
        });
        
        const uniqueClasses = Array.from(classSet);
        console.log("Extracted classes:", uniqueClasses); // Bekræft unikke klassenavne
        setClasses(uniqueClasses);
      } catch (err: any) {
        console.error("Error fetching spells:", err);
        setError("Failed to load spells.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllSpells();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      console.log("Auto-selecting first class:", classes[0]);
      handleTabChange(0); // Vælg den første klasse ved indlæsning
    }
  }, [classes]);
  
  const handleTabChange = (index: number) => {
    const selectedClass = classes[index];
    console.log("Selected class:", selectedClass);
    
    // Filtrer spells ved at sammenligne strings direkte
    const filtered = allSpells.filter((spell) =>
      spell.classes.includes(selectedClass)
    );
  
    console.log("Filtered spells for class:", selectedClass, filtered);
    setFilteredSpells(filtered);
    setCurrentPage(1); // Nulstil siden
  };
  
  

  // Pagination
  const paginatedSpells = filteredSpells.slice(
    (currentPage - 1) * spellsPerPage,
    currentPage * spellsPerPage
  );
  console.log("Paginated spells:", paginatedSpells);

  // Håndter klik på en spell
  const handleCardClick = (spell: APISpell) => {
    console.log("Clicked spell:", spell);
    setSelectedSpell(spell);
    onOpen();
  };

  return (
    <Box p={5}>
      <Heading as="h1" size="2xl" mb={5}>
        Spells by Class
      </Heading>

      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Tabs onChange={handleTabChange}>
          {/* Dynamisk genererede tabs */}
          <TabList>
            {classes.map((className) => (
              <Tab key={className}>{className}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {classes.map((className) => (
              <TabPanel key={className}>
                {paginatedSpells.length > 0 ? (
                  <>
                    <SpellGrid
                      spells={paginatedSpells}
                      onCardClick={handleCardClick}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredSpells.length / spellsPerPage)}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </>
                ) : (
                  <Text>No spells found for this class.</Text>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}

      {/* Modal til detaljer om en spell */}
      {selectedSpell && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedSpell.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>Level:</strong> {selectedSpell.level}
              </Text>
              <Text>
                <strong>Duration:</strong> {selectedSpell.duration}
              </Text>
              <Text>
                <strong>Description:</strong> {selectedSpell.desc.join(" ")}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Spells;
