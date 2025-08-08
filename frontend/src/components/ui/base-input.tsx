import { InputProps } from "@chakra-ui/react";
import { Input } from "./input";

type BaseInputProps = InputProps & {
  fullWidthOnly?: boolean;
};

const BaseInput = ({ fullWidthOnly = false, ...props }: BaseInputProps) => {
  return (
    <Input
      borderStyle={"solid"}
      borderWidth={"1px"}
      padding={"12px 16px"}
      fontSize={{ base: "16px", mdDown: "14px" }}
      lineHeight={"22px"}
      borderColor={'input_border'}
      color={'text_primary'}
      focusRing={'none'}
      w={fullWidthOnly ? "100%" : { base: "377px", mdDown: "100%" }}
      {...props}
    />
  );
};

export default BaseInput;