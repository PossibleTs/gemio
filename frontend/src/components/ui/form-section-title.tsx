import { Text, TextProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type FormSectionTitleProps = TextProps & {
  children: ReactNode;
};

const FormSectionTitle = (props: FormSectionTitleProps) => {
  const { children, ...textProps } = props;

  return (
    <Text
      mb={"20px"}
      color={'text_primary'}
      fontSize={'xl'}
      fontWeight={"bold"}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default FormSectionTitle;