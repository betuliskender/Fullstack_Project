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
          const dddice = new ThreeDDice(containerRef.current, 'k3NXF0vdgun8kRloqu8YvGm0xYgouG3tRF01uA9H0fb96934', {
          });

          await dddice.start();
          await dddice.connect('3IwfNUU');
          diceInstanceRef.current = dddice;
          setIsReady(true);
        } catch (error) {
          console.error('Fejl ved initialisering af DDDice:', error);
        }
      }
    };

    initDDDice();

    // Ryd ressourcer ved unmount
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
    <div>
      <h2>3D Terningekast</h2>
      <canvas ref={containerRef} style={{ width: '400px', height: '300px' }}></canvas>
      <button
        onClick={handleRollDice}
        disabled={!isReady}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isReady ? 'pointer' : 'not-allowed',
        }}
      >
        Rul Terninger
      </button>
    </div>
  );
};

export default RollDice;
