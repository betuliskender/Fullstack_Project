import React, { useEffect, useRef, useState } from 'react';
import { ThreeDDice } from 'dddice-js';

const RollDice: React.FC = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const diceInstanceRef = useRef<ThreeDDice | null>(null);
  const [isReady, setIsReady] = useState(false);

  // List of dice types
  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

  useEffect(() => {
    const initDDDice = async () => {
      if (containerRef.current) {
        try {
          const dddice = new ThreeDDice(
            containerRef.current,
            'imkHZBwWrJZdeM5sncNAOwmEsktalKAkEOcxm8pd535d1ac8',
            {}
          );

          await dddice.start();
          await dddice.connect('UJKHQz5');
          diceInstanceRef.current = dddice;
          setIsReady(true);
        } catch (error) {
          console.error('Fejl ved initialisering af DDDice:', error);
        }
      }
    };

    initDDDice();

    return () => {
      if (diceInstanceRef.current) {
        diceInstanceRef.current.stop();
        diceInstanceRef.current = null;
      }
    };
  }, []);

  // Function to roll a specific dice type
  const handleRollDice = (type: string) => {
    if (diceInstanceRef.current) {
      diceInstanceRef.current.roll([
        {
          theme: 'new-m4fkm2u0',
          type, // Use the type dynamically
        },
      ]);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <canvas
          ref={containerRef}
          style={{
            width: '600px',
            height: '500px',
            borderRadius: '10px',
          }}
        ></canvas>
        <div style={{ marginTop: '10px' }}>
          {diceTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleRollDice(type)}
              disabled={!isReady}
              style={{
                margin: '5px',
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isReady ? 'pointer' : 'not-allowed',
              }}
            >
              Roll {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RollDice;
