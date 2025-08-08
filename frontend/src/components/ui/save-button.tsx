import { Text } from "@chakra-ui/react";
import { Button } from "./button";

type SaveButtonProps = {
  isLoading: boolean;
  onClick?: () => void;
  disableSubmit?: boolean
  textButton?: string
};

const SaveButton = (props: SaveButtonProps) => {
  const { isLoading, onClick, disableSubmit = false, textButton } = props;
  return (
    <Button
      type={!disableSubmit ? "submit" : "button"}
      loading={isLoading}
      onClick={onClick}
      borderRadius={"5px"}
      loadingText="Cadastrando"
      colorScheme="blue" 
      width={{base: "80%", md: "100%"}}
      size="lg"
      bg={"rgba(90, 69, 149)"}
    >
      <Text
        fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
        lineHeight={"23px"}
        letterSpacing={"0.5px"}
      >
        {textButton ?? 'Cadastrar'}
      </Text>
    </Button>
  );
};

export default SaveButton;