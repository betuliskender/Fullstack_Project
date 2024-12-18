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
  Button,
  Box,
} from "@chakra-ui/react";
import { GET_ALL_SKILLS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import CharacterDetailsStep from "./CharacterDetailStep";
import AttributesStep from "./AttributesStep";
import SpellSelector from "./SpellSelectStep";
import SkillSelector from "./SkillSelectStep";
import RaceTraitsPanel from "./RaceTraitsPanel";
import ClassDetailsPanel from "./ClassTaritsPanel";

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
  const [classSpells, setClassSpells] = useState<{ index: string; name: string, desc: string[] }[]>([]);
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
        setClassSpells(data.results.map((spell: { index: string; name: string; desc: string }) => ({
          ...spell,
          desc: [spell.desc],
        })) || []);
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

        setCharacter((prev) => ({
          ...prev,
          race: {
            ...prev.race,
            name: data.name,
            traits: data.traits.map((trait: { name: string }) => trait.name),
            languages: data.languages.map((lang: { name: string }) => lang.name),
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
        fetchClassSpells(classIndex);

        setCharacter((prev) => ({
          ...prev,
          class: {
            ...prev.class,
            name: data.name,
            proficiencies: data.proficiencies.map((prof: { name: string }) => prof.name),
            starting_equipment: data.starting_equipment.map(
              (item: { equipment: { name: string } }) => item.equipment.name
            ),
          },
        }));
      })
      .catch((error) => console.error("Error fetching class details:", error));
  };
  
  const handleSpellSelect = (spell: { name: string; desc: string[] }) => {
    setSelectedSpells((prev) => {
      const isSelected = prev.find((s) => s.name === spell.name);
      if (isSelected) {
        return prev.filter((s) => s.name !== spell.name);
      } else {
        return [...prev, { name: spell.name, description: spell.desc.join(" ") }];
      }
    });
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

  const handleSubmit = async () => {
    try {
      if (token) {
        const newCharacter = await createCharacter(character, token);

        if (newCharacter) {
  
          if (selectedSpells.length > 0) {
            await addSpellsToCharacter(newCharacter._id, selectedSpells, token);
          }
          if (selectedSkills.length > 0) {
            await addSkillsToCharacter(newCharacter._id, selectedSkills, token);
          }
  
          onCharacterCreated(newCharacter);
  
          resetModal(); 
          onClose();
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
                 <CharacterDetailsStep
                 character={character}
                 races={races}
                 classes={classes}
                 onChange={handleChange}
               />
                )}

                {currentStep === 2 && (
                  <AttributesStep
                  attributes={character.attributes}
                  onChange={handleChange}
                  />
                )}

                {currentStep === 3 && (
                  <SpellSelector
                  spells={classSpells}
                  selectedSpells={selectedSpells}
                  onSpellSelect={handleSpellSelect}
                  loading={classSpellsLoading}
                />
                )}
              
                {currentStep === 4 && (
                <SkillSelector
                skills={skillsData?.skills || []}
                selectedSkills={selectedSkills}
                onSkillClick={handleSkillClick}
                loading={skillsLoading}
                />
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
              <RaceTraitsPanel
                raceDetails={selectedRaceDetails}
                onClose={() => setIsTraitsVisible(false)}
              />
            )}

            {/* Class Details Panel */}
            {isClassDetailsVisible && selectedClassDetails && (
              <ClassDetailsPanel
                classDetails={selectedClassDetails}
                onClose={() => setIsClassDetailsVisible(false)}
              />
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
