import { Box } from "@chakra-ui/react";
import { LuPencilLine } from "react-icons/lu";

type EditButtonProps = {
  handleEditData: () => void;
  color?: string;
};

const EditButton = (props: EditButtonProps) => {
  const { handleEditData, color = "#282828" } = props;

  return (
    <Box cursor="pointer" onClick={handleEditData}>
      <LuPencilLine size={"20px"} color={color} />
    </Box>
  );
};

export default EditButton;
