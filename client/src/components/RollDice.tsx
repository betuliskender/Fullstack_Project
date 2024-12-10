import React, { useEffect, useRef, useState } from 'react';
import { ThreeDDice } from 'dddice-js';
import { Box, Button, Flex, HStack, VStack, Text } from '@chakra-ui/react';

const RollDice: React.FC = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const diceInstanceRef = useRef<ThreeDDice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [diceCount, setDiceCount] = useState(1); // Antallet af terninger brugeren vælger

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
      // Opret en liste med antal terninger baseret på brugerens valg
      const diceToRoll = Array(diceCount).fill({
        theme: 'new-m4fkm2u0',
        type,
      });

      diceInstanceRef.current.roll(diceToRoll);
    }
  };

  // Funktion til at justere antallet af terninger
  const adjustDiceCount = (increment: boolean) => {
    setDiceCount((prev) => (increment ? prev + 1 : Math.max(prev - 1, 1)));
  };

  return (
    <Box textAlign="center" p="20px">
      {/* Kontrol for at vælge antal terninger */}

      <Flex mt="10px" justify="center" wrap="wrap">
        {diceTypes.map((type) => (
          <Button
            key={type}
            onClick={() => handleRollDice(type)}
            isDisabled={!isReady}
            m="5px"
            p="8px 16px"
            fontSize="14px"
            bg="green.400"
            color="white"
            borderRadius="md"
            _hover={{
              bg: isReady ? 'green.500' : undefined,
            }}
            _disabled={{
              bg: 'gray.300',
              cursor: 'not-allowed',
            }}
          >
            Roll {type.toUpperCase()}
          </Button>
        ))}
      </Flex>

      <VStack spacing={4} align="center" mb="10px">
        <HStack>
          <Text fontSize="lg" color="white">
            Number of dice:
          </Text>
          <Button
            onClick={() => adjustDiceCount(false)}
            isDisabled={diceCount <= 1}
            size="sm"
            bg="transparent"
            color="white"
            _hover={{
              bg: diceCount > 1 ? 'grey' : undefined,
            }}
          >
            -
          </Button>
          <Text fontSize="lg" fontWeight="bold">
            {diceCount}
          </Text>
          <Button
            onClick={() => adjustDiceCount(true)}
            size="sm"
            bg="transparent"
            color="white"
            _hover={{
              bg: 'grey',
            }}
          >
            +
          </Button>
        </HStack>
      </VStack>
      <Box display="inline-block" position="relative">
        <Box
          as="canvas"
          ref={containerRef}
          w="600px"
          h="500px"
          borderRadius="10px"
        />
      </Box>
    </Box>
  );
};

export default RollDice;
