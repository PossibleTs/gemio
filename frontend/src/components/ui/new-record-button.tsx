"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "./button";

type NewRecordButtonProps = {
  src?: string;
  handleClick?: () => void;
  children: ReactNode;
};
const NewRecordButton = (props: NewRecordButtonProps) => {
  const { src, children, handleClick } = props;
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (src) return router.push(src);
        if (handleClick) return handleClick();
      }}
      // _hover={{
      //   bgColor: "secondary",
      //   color: "darkest",
      // }}
      color={"white"}
      bg={"rgba(90, 69, 149)"}
      colorScheme="blue" 
      size="lg"
      px={'20px'}
      borderRadius={"5px"}
      mb={{base: '20px', sm: '0px'}}
    >
      {children}
    </Button>
  );
};

export default NewRecordButton;
