import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

const RollDice: React.FC = () => {
  const [rollUuid, setRollUuid] = useState<string | null>(null); // Holds the roll's UUID
  const [loading, setLoading] = useState(false); // Loading state for button feedback
  const [error, setError] = useState<string | null>(null); // Error state for user feedback


  const postRoll = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await axios.post(
        'https://dddice.com/api/1.0/roll',
        {
          dice: [
            { type: 'd20', theme: 'dddice-bees' },
            { type: 'd20', theme: 'dddice-bees' },
          ],
          room: 'vd_4qCK', // Optional room configuration
        },
        {
          headers: {
            Authorization: 'Bearer fPSwIQsN1huUaC7oEvjDcHqKwKnSbUUoeuu0vaWFb765b4c6',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log(response.data)

      if (response.data?.data.uuid) {
        setRollUuid(response.data.data.uuid); // Save the roll's UUID for visualization
        console.log('Roll UUID:', response.data.data.uuid);
      } else {
        setError('No UUID found in response. Please check the API response.');
      }
    } catch (err: any) {
      console.error('Error creating roll:', err);
      setError('Failed to create roll. Please check your network or API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" p={5}>
      <Button
        onClick={postRoll}
        isLoading={loading}
        colorScheme="blue"
        size="lg"
        mb={5}
      >
        {loading ? 'Rolling...' : 'Roll Dice'}
      </Button>
      {error && <Text color="red.500" mt={5}>{error}</Text>}
      {rollUuid && (
        <VStack mt={5}>
          <iframe
            src={`https://dddice.com/room/vd_4qCK/stream?key=fDO28LGEhKrldiJplxlRpFURa3BUfBcVwBGPscFW55aa64ee`}
            title="Dice Roll Visualization"
            width="600"
            height="400"
            style={{ border: 'none' }}
          ></iframe>
        </VStack>
      )}
    </Box>
  );
};

export default RollDice;
