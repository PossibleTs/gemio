import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import BaseInput from './ui/base-input';

type FormCheckMnemonicPhraseProps = {
  recoveryWords: string[];
};
export const FormCheckMnemonicPhrase = (
  props: FormCheckMnemonicPhraseProps
) => {
  const { recoveryWords } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [verificationIndices, setVerificationIndices] = useState<number[]>(
    Array.from({ length: 24 }, (_, i) => i)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
  );
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [verifiedWords, setVerifiedWords] = useState<{
    [key: number]: boolean;
  }>({});

  const handleInputChange = (index: number, value: string) => {
    const trimmedValue = value.toLowerCase().trim();
    setInputValues((prev) => ({
      ...prev,
      [index]: trimmedValue,
    }));

    // Check if the word matches
    const isCorrect = trimmedValue === recoveryWords[index];
    setVerifiedWords((prev) => ({
      ...prev,
      [index]: isCorrect,
    }));
  };

  // const isVerificationReady = () => {
  //   return verificationIndices.every(index => verifiedWords[index] === true);
  // };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {recoveryWords.map((word, index) => (
        <GridItem key={index}>
          {verificationIndices.includes(index) ? (
            <HStack>
              <Text fontWeight="medium">
                {(index + 1).toString().padStart(2, '0')}.
              </Text>
              <Box position="relative" width="100%" ml={'-3px'}>
                <BaseInput
                  fullWidthOnly
                  value={inputValues[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  type="text"
                />
                {verifiedWords[index] && (
                  <Box
                    position="absolute"
                    right="8px"
                    top="50%"
                    transform="translateY(-50%)"
                    color="green.500"
                  >
                    ✓
                  </Box>
                )}
              </Box>
            </HStack>
          ) : (
            <HStack h={'100%'}>
              <Text fontWeight="medium">
                {(index + 1).toString().padStart(2, '0')}. {word}
              </Text>
            </HStack>
          )}
        </GridItem>
      ))}
    </Grid>
  );
};

export default FormCheckMnemonicPhrase;
