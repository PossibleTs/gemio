import { Grid, GridItem, Text } from '@chakra-ui/react';

type DisplayMnemonicPhraseProps = {
  recoveryWords: string[];
};
export const DisplayMnemonicPhrase = (props: DisplayMnemonicPhraseProps) => {
  const { recoveryWords } = props;

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {recoveryWords.map((word, index) => (
        <GridItem key={index}>
          <Text fontWeight="medium">
            {(index + 1).toString().padStart(2, '0')}. {word}
          </Text>
        </GridItem>
      ))}
    </Grid>
  );
};

export default DisplayMnemonicPhrase;
