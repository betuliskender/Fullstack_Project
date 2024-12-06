import React, { useEffect, useRef, useState } from 'react';
import { ThreeDDice } from 'dddice-js';

const RollDice: React.FC = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const diceInstanceRef = useRef<ThreeDDice | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDDDice = async () => {
      if (containerRef.current) {
        try {
          const dddice = new ThreeDDice(containerRef.current, 'CDEyUxmMWMM7gvKfcIBDwdoenX8r5eUqgeLqoCZDcc149869', {

          });

          await dddice.start();
          await dddice.connect('D_hH74E');
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

  const handleRollDice = () => {
    if (diceInstanceRef.current) {
      diceInstanceRef.current.roll([{ theme: 'dddice-bees', type: 'd20' }]);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#fff', marginBottom: '10px' }}>3D Terningekast</h2>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <canvas
          ref={containerRef}
          style={{
            width: '400px',
            height: '300px',
            borderRadius: '10px',
            border: '1px solid #4CAF50',
          }}
        ></canvas>
        <button
          onClick={handleRollDice}
          disabled={!isReady}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isReady ? 'pointer' : 'not-allowed',
          }}
        >
          Roll Dice
        </button>
      </div>
    </div>
  );
};

export default RollDice;
