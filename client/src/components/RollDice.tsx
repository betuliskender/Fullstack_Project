import React, { useState } from 'react';
import axios from 'axios';

const RollDice: React.FC = () => {
  const [diceResult, setDiceResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const rollDice = async () => {
    setLoading(true);
    try {
        const response = await axios.post(
        'https://dddice.com/api/1.0/roll',
        {
            "dice": [
        {
            "type": "d20",
            "theme": "dddice-bees"
            
        },
        {
            "type": "d20",
            "theme": "dddice-bees"

        }
    ],
    "room": 'vd_4qCK',
        },
        {
            headers: {
            Authorization: `Bearer yHJV9qb1yP2bAVodJushLTkG4CYZ6phTE5VJtwi794386055`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            },
        }
        );

        // Save the result
        setDiceResult(response.data.url); // Verify if 'url' is the correct field in the response
        console.log('Dice roll result:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error with dice roll:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
      <h2>Rul en terning</h2>
      <button onClick={rollDice} disabled={loading}>
        {loading ? 'Ruller...' : 'Rul D20'}
      </button>
      {diceResult && (
        <div>
          <h3>Resultat:</h3>
          <iframe
            src={diceResult}
            title="3D Terningekast"
            width="500"
            height="300"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default RollDice;
