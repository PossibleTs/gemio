"use client";
import { ButtonProps, Text } from "@chakra-ui/react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const BackButton = (props: ButtonProps) => {
  const router = useRouter();

  return (
    <Button 
      colorScheme="blue"
      variant="outline"
      size="lg"
      width={{base: "80%", md: "100%"}}
      borderRadius={"5px"}
      onClick={router.back} 
      {...props}
    >
      <Text
        fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
        lineHeight={"23px"}
        letterSpacing={"0.5px"}
        color={"rgba(90, 69, 149)"}
      >
        Voltar
      </Text>
    </Button>
  );
};

export default BackButton;