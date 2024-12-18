import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Grid,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import InfoCard from "./InfoCard"; // Importer InfoCard
import DetailsModal from "./DetailsModal"; // Importer DetailsModal
import { APISpell } from "../utility/types";

const Spells: React.FC = () => {
  const [spellsByClass, setSpellsByClass] = useState<{ [className: string]: APISpell[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSpell, setSelectedSpell] = useState<APISpell | null>(null);

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
          const groupedSpells: { [className: string]: APISpell[] } = {};
          detailedSpells.forEach((spell: APISpell) => {
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

  const handleCardClick = (spell: APISpell) => {
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
                  <InfoCard
                    key={spell.index}
                    title={spell.name}
                    details={{
                      Level: spell.level,
                      Duration: spell.duration,
                    }}
                    description={
                      spell.desc && spell.desc.length > 0
                        ? spell.desc[0]
                        : "No description available"
                    }
                    onClick={() => handleCardClick(spell)} // Åbn modal ved klik
                  />
                ))}
              </Grid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Genbrug DetailsModal */}
      <DetailsModal isOpen={isOpen} onClose={onClose} item={selectedSpell} />
    </Box>
  );
};

export default Spells;
