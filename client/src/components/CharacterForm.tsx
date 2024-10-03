import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { createCharacter } from "../utility/apiservice";
import { Character as CharacterType } from "../utility/types";
import { AuthContext } from "../utility/authContext";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const Character: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { user, token } = useContext(AuthContext);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [character, setCharacter] = useState<CharacterType>({
    name: "",
    level: 1,
    race: "",
    class: "",
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in character.attributes) {
      setCharacter({
        ...character,
        attributes: {
          ...character.attributes,
          [name]: Number(value),
        },
      });
    } else {
      setCharacter({
        ...character,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (token) {
        await createCharacter(character, token); // Pass the token to the API service

        setSuccessMessage("Character created successfully"); //NY USESTATE :-)

        // Clear form - JEG CLEARER FORMEN HER :-)
        setCharacter({
          name: "",
          level: 1,
          race: "",
          class: "",
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
      } else {
        console.error("Token is null or undefined");
        // Handle the case where the token is null or undefined
      }
      // Handle success (e.g., navigate to another page or show a success message)
    } catch (error) {
      console.error("Error creating character:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div>
          <h1>Character Management</h1>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={character.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Level:</label>
              <input
                type="number"
                name="level"
                value={character.level}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Race:</label>
              <input
                type="text"
                name="race"
                value={character.race}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Class:</label>
              <input
                type="text"
                name="class"
                value={character.class}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Background:</label>
              <input
                type="text"
                name="background"
                value={character.background}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                name="imageURL"
                value={character.imageURL}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Strength:</label>
              <input
                type="number"
                name="strength"
                value={character.attributes.strength}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Dexterity:</label>
              <input
                type="number"
                name="dexterity"
                value={character.attributes.dexterity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Constitution:</label>
              <input
                type="number"
                name="constitution"
                value={character.attributes.constitution}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Intelligence:</label>
              <input
                type="number"
                name="intelligence"
                value={character.attributes.intelligence}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Wisdom:</label>
              <input
                type="number"
                name="wisdom"
                value={character.attributes.wisdom}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Charisma:</label>
              <input
                type="number"
                name="charisma"
                value={character.attributes.charisma}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Create Character</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>You need to login to see this page</h2>
        </div>
      )}
    </React.Fragment>
  );
};

export default Character;
