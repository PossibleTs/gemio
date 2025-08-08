import { Text } from "@chakra-ui/react";
import { Button, ButtonProps } from "./button";

type UpdateSubmitButtonProps = { isLoading: boolean } & ButtonProps;
const UpdateSubmitButton = (props: UpdateSubmitButtonProps) => {
  const { isLoading, ...rest } = props;

  return (
    <Button
      type="submit"
      // _hover={{
      //   bgColor: "secondary",
      //   color: "darkest",
      // }}
      borderRadius={"5px"}
      colorScheme="blue" 
      width="100%"
      size="lg"
      loading={isLoading}
      loadingText="Atualizando"
      {...rest}
      bg={"rgba(90, 69, 149)"}
    >
      <Text
        fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
        lineHeight={"23px"}
        letterSpacing={"0.5px"}
      >
        Atualizar
      </Text>
    </Button>
  );
};

export default UpdateSubmitButton;
