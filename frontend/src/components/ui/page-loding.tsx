import { Box, Center, Spinner } from '@chakra-ui/react';

type PageLoadingProps = { isLoading: boolean };
const PageLoading = (props: PageLoadingProps) => {
  const { isLoading } = props;
  return isLoading ? (
    <Box position="fixed" inset="0" bg="bg/40" top={0} left={0} zIndex={9999999}>
      <Center h="full">
        <Spinner color="secondary" size={'xl'} />
      </Center>
    </Box>
  ) : null;
};

export default PageLoading;
