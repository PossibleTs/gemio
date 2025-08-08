import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { Mnemonic } from '@hashgraph/sdk';
import { Controller, useForm, useWatch } from 'react-hook-form';
import BaseInput from './ui/base-input';

type MnemonicFormData = {
  words: string[];
};

type FormMnemonicPhraseProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMnemonicPhrase: any;
};
export const FormMnemonicPhrase = (props: FormMnemonicPhraseProps) => {
  const { setMnemonicPhrase } = props;

  const WORD_COUNT = 24;

  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<MnemonicFormData>({
    mode: 'onChange',
    defaultValues: {
      words: Array(24).fill(''),
    },
  });

  const watchedWords = useWatch({ control, name: 'words' });
  const validateMnemonicOnBlur = () => {
    const allFilled = watchedWords.every((word) => word && word.trim() !== '');
    if (!allFilled) return;

    Mnemonic.fromWords(watchedWords)
      .then(() => {
        clearErrors('words');
        setMnemonicPhrase(watchedWords.join(' '));
      })
      .catch(() => {
        setError('words', {
          type: 'manual',
          message: 'Frase mnemônica inválida.',
        });
      });
  };

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {Array.from({ length: WORD_COUNT }).map((_, index) => (
          <GridItem key={index}>
            <HStack align="center" justifyContent={'space-between'}>
              <Text fontWeight="medium">
                {(index + 1).toString().padStart(2, '0')}.
              </Text>
              <Box position="relative" width="80px">
                <Controller
                  key={index}
                  name={`words.${index}` as const}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <BaseInput
                      {...field}
                      fullWidthOnly
                      onBlur={() => {
                        field.onBlur();
                        validateMnemonicOnBlur();
                      }}
                      type="text"
                    />
                  )}
                />
              </Box>
            </HStack>
          </GridItem>
        ))}
      </Grid>

      {typeof errors.words?.message === 'string' && (
        <Box style={{ color: 'red', marginTop: 10 }}>
          {errors.words.message}
        </Box>
      )}
    </Box>
  );
};

export default FormMnemonicPhrase;
