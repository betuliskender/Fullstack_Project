import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { createCharacter } from "../utility/apiservice";
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
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onCharacterCreated: (character: CharacterType) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose, isLoggedIn, onCharacterCreated }) => {
  const { user, token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
  const [isTraitsVisible, setIsTraitsVisible] = useState(false);
  const [isClassDetailsVisible, setIsClassDetailsVisible] = useState(false);

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
  
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "race") {
      setCharacter((prev) => ({
        ...prev,
        race: { ...prev.race, name: value }, // This is redundant as fetchRaceDetails updates it
      }));
      if (value) fetchRaceDetails(value);
    } else if (name === "class") {
      setCharacter((prev) => ({
        ...prev,
        class: { ...prev.class, name: value }, // Same applies here
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
        setSuccessMessage("Character created successfully");

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

        onCharacterCreated(newCharacter);
        onClose();
      } else {
        console.error("Token is null or undefined");
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
                {successMessage && <Text color="green">{successMessage}</Text>}
                <Input placeholder="Name" name="name" value={character.name} onChange={handleChange} mb={3} />
                <Input placeholder="Level" type="number" name="level" value={character.level} onChange={handleChange} mb={3} />

                {/* Race Dropdown */}
                <Select placeholder="Select Race" name="race" value={character.race.name} onChange={handleChange} mb={3}>
                  {races.map((race) => (
                    <option key={race.index} value={race.index}>
                      {race.name}
                    </option>
                  ))}
                </Select>

                {/* Class Dropdown */}
                <Select placeholder="Select Class" name="class" value={character.class.name} onChange={handleChange} mb={3}>
                  {classes.map((classItem) => (
                    <option key={classItem.index} value={classItem.index}>
                      {classItem.name}
                    </option>
                  ))}
                </Select>

                <Input placeholder="Background" name="background" value={character.background} onChange={handleChange} mb={3} />
                <Input placeholder="Image URL" name="imageURL" value={character.imageURL} onChange={handleChange} mb={3} />
                {/* Other attribute inputs */}
                <Input placeholder="Strength" type="number" name="strength" value={character.attributes.strength} onChange={handleChange} mb={3} />
                <Input placeholder="Dexterity" type="number" name="dexterity" value={character.attributes.dexterity} onChange={handleChange} mb={3} />
                <Input placeholder="Constitution" type="number" name="constitution" value={character.attributes.constitution} onChange={handleChange} mb={3} />
                <Input placeholder="Intelligence" type="number" name="intelligence" value={character.attributes.intelligence} onChange={handleChange} mb={3} />
                <Input placeholder="Wisdom" type="number" name="wisdom" value={character.attributes.wisdom} onChange={handleChange} mb={3} />
                <Input placeholder="Charisma" type="number" name="charisma" value={character.attributes.charisma} onChange={handleChange} mb={3} />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Create Character
                </Button>
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
                <Text>Alignment: {selectedRaceDetails.alignment}</Text>
                <Text>Age: {selectedRaceDetails.age}</Text>
                <Text>Size: {selectedRaceDetails.size_description}</Text>
                <Text mt={2} fontWeight="bold">Languages:</Text>
                <Text>{selectedRaceDetails.languages.map((lang: { name: string }) => lang.name).join(", ")}</Text>
                <Text mt={2} fontWeight="bold">Traits:</Text>
                <ul>
                  {selectedRaceDetails.traits.map((trait: { index: string; name: string }) => (
                    <li key={trait.index}>{trait.name}</li>
                  ))}
                </ul>
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
                <Text>Proficiencies:</Text>
                <ul>
                  {selectedClassDetails.proficiencies.map((prof: { index: string; name: string }) => (
                    <li key={prof.index}>{prof.name}</li>
                  ))}
                </ul>
                <Text>Starting Equipment:</Text>
                <ul>
                  {selectedClassDetails.starting_equipment.map((item: { equipment: { name: string } }) => (
                    <li key={item.equipment.name}>{item.equipment.name}</li>
                  ))}
                </ul>
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
