import { Box } from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";

type DetailsButtonProps = {
  handleDetailsData: () => void;
  color?: string;
};

const DetailsButton = (props: DetailsButtonProps) => {
  const { handleDetailsData, color = "#282828" } = props;

  return (
    <Box cursor="pointer" onClick={handleDetailsData}>
      <MdOutlineRemoveRedEye size={"20px"} color={color} />
    </Box>
  );
};

export default DetailsButton;
