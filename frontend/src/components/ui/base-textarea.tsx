import { TextareaProps, Textarea } from "@chakra-ui/react";

type BaseTextareaProps = TextareaProps & {
  fullWidthOnly?: boolean;
};

const BaseTextarea = ({ fullWidthOnly = false, ...props }: BaseTextareaProps) => {
  return (
    <Textarea
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

export default BaseTextarea;