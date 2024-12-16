import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Text,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

interface Spell {
  index: string;
  name: string;
  level: number;
  duration: string;
  desc: string[];
  classes: { name: string }[];
}

const Spells: React.FC = () => {
  const [spellsByClass, setSpellsByClass] = useState<{ [className: string]: Spell[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  // Fetch spells and organize by class
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        setLoading(true);

        // Check if cached data exists
        const cachedSpells = localStorage.getItem("spellsData");
        if (cachedSpells) {
          setSpellsByClass(JSON.parse(cachedSpells));
          setLoading(false);
          return;
        }

        // Fetch spells from API
        const response = await fetch("https://www.dnd5eapi.co/api/spells");
        const data = await response.json();

        if (data.results) {
          const detailedSpells = await Promise.all(
            data.results.map(async (spell: { index: string; url: string }) => {
              const spellDetailsResponse = await fetch(
                `https://www.dnd5eapi.co${spell.url}`
              );
              return await spellDetailsResponse.json();
            })
          );

          // Group spells by class
          const groupedSpells: { [className: string]: Spell[] } = {};
          detailedSpells.forEach((spell: Spell) => {
            spell.classes.forEach((classItem) => {
              if (!groupedSpells[classItem.name]) {
                groupedSpells[classItem.name] = [];
              }
              groupedSpells[classItem.name].push(spell);
            });
          });

          // Cache the data
          localStorage.setItem("spellsData", JSON.stringify(groupedSpells));
          setSpellsByClass(groupedSpells);
        } else {
          throw new Error("No spells found.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  const handleCardClick = (spell: Spell) => {
    setSelectedSpell(spell);
    onOpen();
  };

  if (loading) return <Spinner size="xl" />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load spells: {error}
      </Alert>
    );

  return (
    <Box p={5}>
      <Heading as="h1" size="2xl" mb={5}>
        Spells by Class
      </Heading>
      <Tabs variant="enclosed">
        {/* Render a tab for each class */}
        <TabList>
          {Object.keys(spellsByClass).map((className) => (
            <Tab key={className}>{className}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {Object.entries(spellsByClass).map(([className, spells]) => (
            <TabPanel key={className}>
              <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {spells.map((spell) => (
                  <Card
                    key={spell.index}
                    boxShadow="md"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleCardClick(spell)}
                  >
                    <CardHeader>
                      <Heading as="h3" size="md">
                        {spell.name}
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>
                        <strong>Level:</strong> {spell.level}
                      </Text>
                      <Text>
                        <strong>Duration:</strong> {spell.duration}
                      </Text>
                      <Text mt={2}>
                        {spell.desc && spell.desc.length > 0
                          ? spell.desc[0].length > 100
                            ? `${spell.desc[0].substring(0, 100)}...`
                            : spell.desc[0]
                          : "No description available"}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Modal to display full spell details */}
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
              <Text mt={2}>
                <strong>Duration:</strong> {selectedSpell.duration}
              </Text>
              <Text mt={4}>
                <strong>Description:</strong>{" "}
                {selectedSpell.desc ? selectedSpell.desc.join(" ") : "No description available"}
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
