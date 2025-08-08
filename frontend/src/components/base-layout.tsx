import { Box, Flex } from '@chakra-ui/react';
import SideMenu from '@app/components/side-menu';
import constants from '@app/constants';

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return  (
    <Flex minH={'100vh'} position={'relative'}>
      <Box 
        zIndex={{base: 5, lg: 0}} 
        position="relative" 
      >
        <SideMenu />
      </Box>
      <Box
        w={{ base: '100vw', mdDown: '100vw', mdOnly: '100vw' }}
        overflow={'hidden'}
        position="relative"
        boxShadow={{base: 'none', lg: constants.shadows.sideMenuShadow}}
      >
        <Box minHeight={'100%'} py={3} paddingTop={{ base: "3.5rem", md: "4.5rem", lg: "2.5rem"}}>
          <Box m={{ base: "40px", mdDown: "20px" }} mt={'0px'}>
            {children}
          </Box>
        </Box>
      </Box>
    </Flex>
  ) 
}
