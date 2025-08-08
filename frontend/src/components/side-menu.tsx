'use client';

import { Box, VStack, HStack, Text, Icon, Flex, Image } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { UseSessionReturn } from '@app/types/Session';
import { useSession } from 'next-auth/react';
import services from '@app/services';
import { RxHamburgerMenu } from "react-icons/rx";
import { GrClose } from "react-icons/gr";
import { themeTokens } from "@app/config/theme";
import useSideMenuIsOpen from '@app/hooks/useSideMenuIsOpen';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft  } from "react-icons/md";
import { usePathname } from 'next/navigation'
import primaryMarket from '@app/assets/register-icons/primary-market.png';
import manufacturer from '@app/assets/register-icons/manufacturer.png';
import mechanic from '@app/assets/register-icons/mechanic.png';
import ImageNext from 'next/image';
import { FaUserTie } from "react-icons/fa6";
import useScrollY from '@app/hooks/useScrollY';
import { sideMenuItems } from '@app/constants/sideMenu';

export default function SideMenu() {
  const [collapse, setCollapse] = useState(true);

  const session = useSession() as UseSessionReturn;
  const { handleSideMenuIsOpen, isOpen } = useSideMenuIsOpen();

  const pathname = usePathname()

  const basePath = '/' + pathname.split('/').slice(1, 3).join('/');

  const scrollY = useScrollY();

  const menuItems = sideMenuItems(session);

  return (
    <>
      <Box
        display={{ base: "none", mdDown: "block", mdOnly: "block" }}
        position="absolute"
        top={"35px"}
        left={{ base: "70px", mdDown: "22px", mdOnly: "40px" }}
      >
        {isOpen && (
          <GrClose
            size={26}
            color={themeTokens.colors.base_white.value}
            cursor={"pointer"}
            onClick={handleSideMenuIsOpen}
          />
        )}
        {!isOpen && (
          <RxHamburgerMenu
            color={themeTokens.colors.dark_gray.value}
            size={26}
            cursor={"pointer"}
            onClick={handleSideMenuIsOpen}
          />
        )}
      </Box>

      <Box
        w={{
          base: "270px",
          mdDown: isOpen ? "100vw" : "270px",
          mdOnly: isOpen ? "100vw" : "270px",
          lg: collapse ? "270px" : "120px",
        }}
        minW={collapse ? "270px" : "120px"}
        h={"100%"}
        minH="100dvh"
        bgColor={"side_menu_color"}
        color={"white"}
        overflowY={"scroll"}
        top={0}
        transition="all 0.3s ease"
        position={{
          base: "relative",
          mdDown: isOpen ? "unset" : "absolute",
          mdOnly: isOpen ? "unset" : "absolute",
        }}
        left={{
          base: isOpen ? "0" : "-270px",
          lg: "0",
        }}
        zIndex={{ base: 2, mdDown: 10 }}
        _scrollbar={{ display: "none" }}
        display="flex"
        flexDirection="column"
      >
        <Box padding={collapse ? "24px 22px 42px" : "24px 15px 42px"} flex="1" display="flex" flexDirection="column">
          <Box position="relative" zIndex={2} mb={{base: '20px', lg: '100px'}}>
            <Box
              position="fixed"
              top={27 - scrollY + 'px'}
              left={{ base: "50%", md: "50%", lg: collapse ? "20px" : "15px" }}
              transform={{ base: "translateX(-50%)", md: "translateX(-50%)", lg: "none" }}
              transition="left 0.3s ease, transform 0.3s ease"
            >
              <Image
                width="180px"
                src="/logo-white.svg"
                alt="Gemio logo"
              />
            </Box>
            <Box
              position="fixed"
              top={-50 - scrollY + 'px'}
              left={{ base: "50%", md: "50%", lg: collapse ? "210px" : "65px" }}
              w={'55px'}
              transition="left 0.3s ease, w 0.3s ease"
              bg={'side_menu_color'}
            >
              <Button 
                bg={"rgba(90, 69, 149)"}
                _hover={{ bg: '#8b78b2' }}
                onClick={() => setCollapse(!collapse)}
                display={{base: 'none', lg: 'block'}}
                mt={'80px'}
              >
                {collapse ? (
                  <Icon as={MdKeyboardDoubleArrowLeft} boxSize={7}/>
                ):(
                  <Icon as={MdKeyboardDoubleArrowRight} boxSize={7} />
                )}
              </Button>
            </Box>
          </Box>

          <Flex flexDirection={'column'} justifyContent={'space-between'} h={'100%'}>
            <VStack align="start" w={'100%'} gap={4} flex="1" mt={{base: '100px', lg: '0px'}} mb={'50px'}>
              {(session.data?.user?.usr_permission === 'admin'
                ? menuItems.admin
                : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'owner'
                ? menuItems.owner
                : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'maintainer'
                ? menuItems.maintainer
                : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'creator'
                ? menuItems.creator
                : []
              ).map(({ section }, sectionIndex) => (
                <Box w={'100%'} mb={'10px'} key={sectionIndex}>
                  <Text
                    fontSize={'14px'}
                    w={'100%'}
                    textAlign={'start'}
                    h={'25px'}
                    maxWidth={collapse ? '100%' : '0%'}
                    transition="max-width 0.2s ease"
                    overflow="hidden"
                    whiteSpace={collapse ? "wrap" : "nowrap"}
                    mb={'5px'}
                  >
                    {section.name}
                  </Text>
                  {section.items.map((menu, index) => (
                    <Box w="100%" key={index} mb={1}>
                      <Link href={menu.url}>
                        <HStack
                          as="button"
                          cursor={'pointer'}
                          bg={menu.url === basePath ? "rgba(90, 69, 149)" : 'side_menu_color'}
                          gap={3}
                          _hover={{ bg: '#8b78b2' }}
                          p={2}
                          w="full"
                          borderRadius="md"
                          onClick={() => handleSideMenuIsOpen()}
                        >
                          <Flex 
                            w={'100%'}
                            gap={collapse ? '15px' : '1px'} 
                            justifyContent={collapse ? 'flex-start' : 'center'}
                            alignItems={'center'}
                            marginLeft={collapse ? '5px' : '0px'}
                            transition="all 0.2s ease"
                          >
                            <Icon w={collapse ? '20%' : '100%'} as={menu.icon} boxSize={5} />
                            <Text
                              w={'80%'}
                              textAlign={'start'}
                              h={'25px'}
                              maxWidth={collapse ? '80%' : '0%'}
                              transition="max-width 0.2s ease"
                              overflow="hidden"
                              whiteSpace={collapse ? "wrap" : "nowrap"}
                            >
                              {menu.name}
                            </Text>
                          </Flex>
                        </HStack>
                      </Link>
                    </Box>
                  ))}
                </Box>
              ))}
            </VStack>

            <HStack
              gap={3}
              w="full"
              borderRadius="md"
            >
              <Flex 
                w={'100%'} 
                h={50}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Flex 
                  w={collapse? '100%' : '0%'}
                  h={'210'}
                  transform={collapse ? 'translateX(0)' : 'translateX(-20px)'}
                  transition="all 0.2s ease"
                >
                  {collapse ? (
                    <Flex 
                      gap={'10px'}
                      maxWidth={collapse ? '250px' : '0px'}
                      transition="max-width 0.2s ease"
                    >
                      <Flex 
                        bg={'#ffffff'} 
                        rounded={'100%'} 
                        w={'50px'} 
                        justifyContent={'center'} 
                        alignItems={'center'}
                      >
                        {session?.data?.user?.usr_permission === 'admin' 
                        ? <Icon as={FaUserTie} boxSize={7} color={'black'} />
                        : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'owner' 
                        ? <ImageNext src={primaryMarket} alt="User permission image" width={30}/>
                        : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'maintainer'
                        ? <ImageNext src={mechanic} alt="User permission image" width={30}/>
                        : session.data?.user?.usr_permission === 'company' && session.data?.user?.com_type === 'creator'
                        ? <ImageNext src={manufacturer} alt="User permission image" width={30}/>
                        : null
                        }
                      </Flex>
                      <Flex flexDirection={'column'} justifyContent={'flex-start'}>
                        <Text
                          truncate 
                          textAlign={'start'}
                          maxW="130px"
                          title={session?.data?.user?.usr_name ?? ""}
                        >
                          {collapse && session?.data?.user?.usr_name}
                        </Text>
                        <Text 
                          textAlign={'start'}
                        >
                          {collapse && session?.data?.user?.usr_permission && (
                            session.data.user.usr_permission === 'admin' 
                            ? session.data.user.usr_permission.charAt(0).toUpperCase() + session.data.user.usr_permission?.slice(1) 
                            : session.data.user.usr_permission === 'company' 
                              ? session.data.user.com_type 
                              ? session.data.user.com_type?.charAt(0).toUpperCase() + session.data.user.com_type?.slice(1) 
                              : ''
                            : ''
                          )}
                        </Text>
                      </Flex>
                    </Flex>
                  ): null} 
                </Flex>
                <Flex
                  as="button"
                  cursor={'pointer'}
                  p={2}
                  _hover={{ bg: '#8b78b2' }}
                  bg={'side_menu_color'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  borderRadius="md"
                  onClick={services.auth.logOut}
                  w={collapse? 'auto' : '100%'}
                >
                  <Icon as={FiLogOut} boxSize={5} />
                </Flex>
              </Flex>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
