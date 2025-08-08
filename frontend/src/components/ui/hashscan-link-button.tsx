import { Box } from "@chakra-ui/react";
import Image from "next/image";
import hashscanIcon from '@app/assets/hashscan_icon.svg';

type HashscanLinkButtonProps = {
  handleHashscanLinkData: () => void;
};

const HashscanLinkButton = (props: HashscanLinkButtonProps) => {
  const { handleHashscanLinkData } = props;

  return (
    <Box
      cursor={"pointer"}
      onClick={handleHashscanLinkData}
      opacity={1}
      w={'20px'}
    >
      <Image
        src={hashscanIcon}
        alt="Hashscan logo"
        width={20}
        height={0}
        priority
      />
    </Box>
  );
};

export default HashscanLinkButton;