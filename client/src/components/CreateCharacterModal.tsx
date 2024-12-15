import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { addSkillsToCharacter, addSpellsToCharacter, createCharacter } from "../utility/apiservice";
import { Character as CharacterType } from "../utility/types";
import { AuthContext } from "../utility/authContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Text,
  Select,
  Box,
  IconButton,
  Heading,
  Spinner,
  Grid,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { GET_ALL_SKILLS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onCharacterCreated: (character: CharacterType) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose, isLoggedIn, onCharacterCreated }) => {
  const { user, token } = useContext(AuthContext);
  const { data: skillsData, loading: skillsLoading} = useQuery(GET_ALL_SKILLS);
  const [selectedSpells, setSelectedSpells] = useState<{ name: string; description: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<{ _id: string; name: string; abilityScore: string }[]>([]);

  const [isTraitsVisible, setIsTraitsVisible] = useState(false);
  const [isClassDetailsVisible, setIsClassDetailsVisible] = useState(false);
  const [classSpells, setClassSpells] = useState<{ index: string; name: string, desc: string }[]>([]);
  const [classSpellsLoading, setClassSpellsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [character, setCharacter] = useState<CharacterType>({
    name: "",
    level: 1,
    race: {
      name: "",
      traits: [],
      languages: [],
    },
    class: {
      name: "",
      proficiencies: [],
      starting_equipment: [],
    },
    background: "",
    imageURL: "",
    attributes: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    user: user?._id || "",
  });
  const [races, setRaces] = useState<{ index: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ index: string; name: string }[]>([]);
  const [selectedRaceDetails, setSelectedRaceDetails] = useState<{
    name: string;
    alignment: string;
    age: string;
    size_description: string;
    languages: { name: string }[];
    traits: { index: string; name: string }[];
  } | null>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<{
    name: string;
    proficiencies: { index: string; name: string }[];
    starting_equipment: { equipment: { name: string } }[];
  } | null>(null);

  const fetchClassSpells = (classIndex: string) => {
    setClassSpellsLoading(true);
    fetch(`https://www.dnd5eapi.co/api/classes/${classIndex}/spells`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setClassSpells(data.results || []);
      })
      .catch((error) => console.error("Error fetching class spells:", error))
      .finally(() => setClassSpellsLoading(false));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Fetch all races and classes when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch("https://www.dnd5eapi.co/api/races", {
        method: "GET",
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setRaces(data.results);
        })
        .catch((error) => console.error("Error fetching races:", error));

      fetch("https://www.dnd5eapi.co/api/classes", {
        method: "GET",
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setClasses(data.results);
        })
        .catch((error) => console.error("Error fetching classes:", error));
    }
  }, [isOpen]);

  // Fetch selected race details
  const fetchRaceDetails = (raceIndex: string) => {
    fetch(`https://www.dnd5eapi.co/api/races/${raceIndex}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedRaceDetails(data);
        setIsTraitsVisible(true);
  
        // Update character state with race details
        setCharacter((prev) => ({
          ...prev,
          race: {
            ...prev.race,
            name: data.name,
            traits: data.traits.map((trait: { name: string }) => trait.name), // Save traits
            languages: data.languages.map((lang: { name: string }) => lang.name), // Save languages
          },
        }));
      })
      .catch((error) => console.error("Error fetching race details:", error));
  };
  
  const handleSpellClick = (spell: { name: string; desc: string }) => {
    setSelectedSpells((prev) => {
      // Toggle selection
      const isSelected = prev.find((s) => s.name === spell.name);
      if (isSelected) {
        return prev.filter((s) => s.name !== spell.name);
      } else {
        return [...prev, { name: spell.name, description: spell.desc }];
      }
    });
  };

  const resetModal = () => {
    setCharacter({
      name: "",
      level: 1,
      race: {
        name: "",
        traits: [],
        languages: [],
      },
      class: {
        name: "",
        proficiencies: [],
        starting_equipment: [],
      },
      background: "",
      imageURL: "",
      attributes: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      user: user?._id || "",
    });
    setSelectedSkills([]);
    setSelectedSpells([]);
    setCurrentStep(1);
  };

  // Fetch selected class details
  const fetchClassDetails = (classIndex: string) => {
    fetch(`https://www.dnd5eapi.co/api/classes/${classIndex}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedClassDetails(data);
        setIsClassDetailsVisible(true);
        fetchClassSpells(classIndex); // Fetch spells for the selected class

  
        // Update character state with class details
        setCharacter((prev) => ({
          ...prev,
          class: {
            ...prev.class,
            name: data.name,
            proficiencies: data.proficiencies.map((prof: { name: string }) => prof.name), // Save proficiencies
            starting_equipment: data.starting_equipment.map(
              (item: { equipment: { name: string } }) => item.equipment.name
            ), // Save starting equipment
          },
        }));
      })
      .catch((error) => console.error("Error fetching class details:", error));
  };
  
  const handleSkillClick = (skill: { _id: string; name: string; abilityScore: string }) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.find((s) => s._id === skill._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== skill._id);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "race") {
      setCharacter((prev) => ({
        ...prev,
        race: { ...prev.race, name: value },
      }));
      if (value) fetchRaceDetails(value);
    } else if (name === "class") {
      setCharacter((prev) => ({
        ...prev,
        class: { ...prev.class, name: value },
      }));
      if (value) fetchClassDetails(value);
    } else if (name in character.attributes) {
      setCharacter((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [name]: Number(value) },
      }));
    } else {
      setCharacter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (token) {
        const newCharacter = await createCharacter(character, token);
  
        // Tjek for succes
        if (newCharacter) {
  
          // Tilføj spells og skills, hvis de findes
          if (selectedSpells.length > 0) {
            await addSpellsToCharacter(newCharacter._id, selectedSpells, token);
          }
          if (selectedSkills.length > 0) {
            await addSkillsToCharacter(newCharacter._id, selectedSkills, token);
          }
  
          // Opdater listen i den overordnede komponent
          onCharacterCreated(newCharacter);
  
          // Luk modal
          resetModal(); // Nulstil tilstanden
          onClose(); // Luk modal
        } else {
          console.error("Failed to create character");
        }
      }
    } catch (error) {
      console.error("Error creating character:", error);
    }
  };
  

  return (
    <>
      {isLoggedIn && (
        <Modal isOpen={isOpen} onClose={onClose} size={isTraitsVisible || isClassDetailsVisible ? "6xl" : "lg"}>
          <ModalOverlay />
          <ModalContent display="flex" flexDirection="row">
            <Box flex="2">
              <ModalHeader>Create Character</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {currentStep === 1 && (
                <>
                  <Heading size="sm" mb={4}>
                    Step 1: Character details
                  </Heading>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Name" name="name" value={character.name} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Level</FormLabel>
                    <Input placeholder="Level" type="number" name="level" value={character.level} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Race</FormLabel>
                    <Select placeholder="Select Race" name="race" value={character.race.index} onChange={handleChange} mb={3}>
                      {races.map((race) => (
                        <option key={race.index} value={race.index}>
                          {race.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Class</FormLabel>
                      <Select placeholder="Select Class" name="class" value={character.class.index} onChange={handleChange} mb={3}>
                        {classes.map((cls) => (
                          <option key={cls.index} value={cls.index}>
                            {cls.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Background</FormLabel>
                    <Input placeholder="Background" name="background" value={character.background} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Image URL</FormLabel>
                    <Input placeholder="Image URL" name="imageURL" value={character.imageURL} onChange={handleChange} mb={3} />
                  </FormControl>
                  </>
                )}

                {currentStep === 2 && (
                <>
                  <Heading size="sm" mb={4}>
                    Step 2: Attributes 
                  </Heading>
                  <FormControl>
                    <FormLabel>Strength</FormLabel>
                    <Input placeholder="Strength" type="number" name="strength" value={character.attributes.strength} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Dexterity</FormLabel>
                    <Input placeholder="Dexterity" type="number" name="dexterity" value={character.attributes.dexterity} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Constitution</FormLabel>
                    <Input placeholder="Constitution" type="number" name="constitution" value={character.attributes.constitution} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Intelligence</FormLabel>
                    <Input placeholder="Intelligence" type="number" name="intelligence" value={character.attributes.intelligence} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Wisdom</FormLabel>
                    <Input placeholder="Wisdom" type="number" name="wisdom" value={character.attributes.wisdom} onChange={handleChange} mb={3} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Charisma</FormLabel>
                    <Input placeholder="Charisma" type="number" name="charisma" value={character.attributes.charisma} onChange={handleChange} mb={3} />
                  </FormControl>
                  </>
                )}

                {currentStep === 3 && (
                  <Box overflow={"auto"} height={"70vh"}>
                    <Heading size="sm" mb={4}>
                      Step 3: Select Spells
                    </Heading>
                    {classSpellsLoading && (
                      <Box textAlign="center" my={4}>
                        <Spinner size="lg" />
                        <Text>Loading Class Spells...</Text>
                      </Box>
                    )}
                    {!classSpellsLoading && classSpells.length > 0 && (
                      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                        {classSpells.map((spell) => (
                          <Box
                            key={spell.index}
                            border="1px solid"
                            borderColor={selectedSpells.some((s) => s.name === spell.name) ? "green.500" : "gray.200"}
                            borderRadius="md"
                            p={2} // Reduced padding
                            shadow="sm" // Reduced shadow for compact look
                            cursor="pointer"
                            onClick={() => handleSpellClick(spell)}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            <Heading as="h3" size="sm" mb={1} textAlign="center">
                              {spell.name}
                            </Heading>
                          </Box>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
              
              {currentStep === 4 && (
                <Box overflow={"auto"} height={"70vh"}>
                  <Heading size="sm" mb={4}>
                    Step 4: Select Skills
                  </Heading>
                  {skillsLoading && (
                    <Box textAlign="center" my={4}>
                      <Spinner size="lg" />
                      <Text>Loading Skills...</Text>
                    </Box>
                  )}
                  {!skillsLoading && skillsData && skillsData.skills.length > 0 && (
                    <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                      {skillsData.skills.map((skill: { _id: string; name: string; abilityScore: string }) => (
                        <Box
                          key={skill._id}
                          border="1px solid"
                          borderColor={selectedSkills.some((s) => s._id === skill._id) ? "green.500" : "gray.200"}
                          borderRadius="md"
                          p={2} // Reduced padding
                          shadow="sm" // Reduced shadow for compact look
                          cursor="pointer"
                          onClick={() => handleSkillClick(skill)}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <Heading as="h3" size="sm" mb={1} textAlign="center">
                            {skill.name}
                          </Heading>
                          <Text fontSize="xs" color="gray.600" textAlign="center">
                            {skill.abilityScore}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              </ModalBody>
              <ModalFooter>
                {currentStep > 1 && <Button onClick={prevStep}>Back</Button>}
                {currentStep < 4 && <Button onClick={nextStep}>Next</Button>}
                {currentStep === 4 && <Button onClick={handleSubmit}>Create Character</Button>}
                <Button variant="ghost" onClick={onClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </Box>

            {/* Race Traits Panel */}
            {isTraitsVisible && selectedRaceDetails && (
              <Box flex="1" p={4} borderLeft="1px solid gray" position="relative">
                <IconButton
                  aria-label="Close Traits"
                  icon={<CloseIcon />}
                  size="sm"
                  position="absolute"
                  top="2"
                  right="2"
                  onClick={() => setIsTraitsVisible(false)}
                />
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {selectedRaceDetails.name} Traits
                </Text>
                <Text mt={2} fontWeight="bold">Alignment: </Text>{selectedRaceDetails.alignment}
                <Text mt={2} fontWeight="bold">Age: </Text>{selectedRaceDetails.age}
                <Text mt={2} fontWeight="bold">Size: </Text> {selectedRaceDetails.size_description}
                <Text mt={2} fontWeight="bold">Languages:</Text>
                <Text>{selectedRaceDetails.languages.map((lang: { name: string }) => lang.name).join(", ")}</Text>
                <Text mt={2} fontWeight="bold">Traits:</Text>
                <Box as="ul" paddingLeft={5}>
                  {selectedRaceDetails.traits.map((trait: { index: string; name: string }) => (
                    <li key={trait.index}>{trait.name}</li>
                  ))}
                </Box>
              </Box>
            )}

            {/* Class Details Panel */}
            {isClassDetailsVisible && selectedClassDetails && (
              <Box flex="1" p={4} borderLeft="1px solid gray" position="relative">
                <IconButton
                  aria-label="Close Class Details"
                  icon={<CloseIcon />}
                  size="sm"
                  position="absolute"
                  top="2"
                  right="2"
                  onClick={() => setIsClassDetailsVisible(false)}
                />
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {selectedClassDetails.name} Details
                </Text>
                <Text mt={2} fontWeight="bold">Proficiencies:</Text>
                <Box as="ul" paddingLeft={5}>
                  {selectedClassDetails.proficiencies.map((prof: { index: string; name: string }) => (
                    <li key={prof.index}>{prof.name}</li>
                  ))}
                </Box>
                <Text mt={2} fontWeight="bold">Starting Equipment:</Text>
                <Box as="ul" paddingLeft={5}>
                  {selectedClassDetails.starting_equipment.map((item: { equipment: { name: string } }) => (
                    <li key={item.equipment.name}>{item.equipment.name}</li>
                  ))}
                </Box>
              </Box>
            )}
          </ModalContent>
        </Modal>
      )}
      {!isLoggedIn && (
        <div>
          <h2>You need to login to see this page</h2>
        </div>
      )}
    </>
  );
};

export default CharacterModal;
