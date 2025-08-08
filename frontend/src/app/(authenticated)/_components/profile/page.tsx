'use client';

import { Button } from "@app/components/ui/button";
import Label from "@app/components/ui/label";
import PageTitle from "@app/components/ui/page-title";
import constants from "@app/constants";
import { UseSessionReturn } from "@app/types/Session";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const session = useSession() as UseSessionReturn;

  const basePath = session.data?.user?.usr_permission === 'company'
    ? session.data?.user?.com_type
    : session.data?.user?.usr_permission;

  return (
    <Box>
      <Flex justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Flex flex="1" minWidth="200px">
          <PageTitle>Perfil</PageTitle>
        </Flex>
      </Flex>

      <Box mb={'60px'}>
        <Box mb={'30px'}>
          <Label labelText={'Nome:'} />
          <Text
            fontSize={{ base: "16px", mdDown: "14px" }}
            lineHeight={"22px"}
            color={'text_primary'}
          >
            {session.data?.user?.usr_name}
          </Text>
        </Box>
        <Box>
          <Label labelText={'E-mail:'} />
          <Text
            fontSize={{ base: "16px", mdDown: "14px" }}
            lineHeight={"22px"}
            color={'text_primary'}
          >
            {session.data?.user?.usr_email}
          </Text>
        </Box>
      </Box>

      <Flex gap={constants.forms.SUBMIT_BUTTONS_GAP}>
        <Link href={`/${basePath}/profile/edit-profile`}>
          <Button
            borderRadius={"5px"}
            colorScheme="blue" 
            px={'20px'}
            size="lg"
            bg={"rgba(90, 69, 149)"}
          >
            <Text 
              fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
            >
              Editar perfil
            </Text>
          </Button>
        </Link>
        <Link href={`/${basePath}/profile/edit-password`}>
          <Button
            borderRadius={"5px"}
            colorScheme="blue" 
            px={'20px'}
            size="lg"
            bg={"rgba(90, 69, 149)"}
          >
            <Text 
              fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
              lineHeight={"23px"}
              letterSpacing={"0.5px"}
            >
              Alterar senha
            </Text>
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}