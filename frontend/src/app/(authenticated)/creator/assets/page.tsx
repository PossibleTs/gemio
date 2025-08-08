'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import PageTitle from '@app/components/ui/page-title';

export default function Assets() {
  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Equipamentos</PageTitle>
        </Flex>
      </Flex>

      <Text mb={"28px"}>
        Em desenvolvimento
      </Text>
    </Box>
  );
}
