import { Box } from "@chakra-ui/react";

import { MdDeleteOutline } from "react-icons/md";

type DeleteButtonProps = {
  handleDeleteData: () => void;
  color?: string;
};

const DeleteButton = (props: DeleteButtonProps) => {
  const { handleDeleteData, color = "#282828" } = props;

  return (
    <Box
      cursor={"pointer"}
      onClick={handleDeleteData}
      opacity={1}
    >
      <MdDeleteOutline color={color} size={"20px"} />
    </Box>
  );
};

export default DeleteButton;
