import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { AuthContext } from "../utility/authContext";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";
import "../styles/character.css";
import { deleteCharacter } from "../utility/apiservice";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CharacterType: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState<Character[]>([]);

  const { loading, error, data, refetch } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (isLoggedIn && token) {
      refetch();
    }
  }, [isLoggedIn, token, refetch]);

  useEffect(() => {
    if (data && data.characters) {
      setCharacters(data.characters);
    }
  }, [data]);

  console.log(characters);

  const handleDelete = async (id: string) => {
    try {
      if (token) {
        console.log(`Deleting character with id: ${id}`);
        await deleteCharacter(id, token);
        console.log(`Character with id: ${id} deleted successfully`);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };


  if (!isLoggedIn || !token) {
    return <p>You must be logged in to view characters.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="header-container">
        <h1>Characters</h1>
        <Link to="/create-character">
          <button className="create-button">Create New Character</button>
        </Link>
      </div>
      <div className="character-grid">
        {characters.map((char: Character) => (
          <div key={char._id} className="character-card">
            <h3>{char.name}</h3>
            <img src={char.imageURL} alt={char.name} className="character-image" />
            <p>Level: {char.level}</p>
            <p>Race: {char.race}</p>
            <p>Class: {char.class}</p>
            <p>Background: {char.background}</p>
            <p>Strength: {char.attributes.strength}</p>
            <p>Dexterity: {char.attributes.dexterity}</p>
            <p>Constitution: {char.attributes.constitution}</p>
            <p>Intelligence: {char.attributes.intelligence}</p>
            <p>Wisdom: {char.attributes.wisdom}</p>
            <p>Charisma: {char.attributes.charisma}</p>
            <button onClick={() => char._id && handleDelete(char._id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterType;