import { Box } from "@chakra-ui/react";

import { FaRegCheckCircle } from "react-icons/fa";

type ApproveButtonProps = {
  handleApproveData: () => void;
  color?: string;
};

const approveButton = (props: ApproveButtonProps) => {
  const { handleApproveData, color = "#282828" } = props;

  return (
    <Box
      cursor={"pointer"}
      onClick={handleApproveData}
      opacity={1}
    >
      <FaRegCheckCircle  color={color} size={"20px"} />
    </Box>
  );
};

export default approveButton;
