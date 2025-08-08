import { Text, TextProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type PageTitleProps = TextProps & {
  children: ReactNode;
};

const PageTitle = (props: PageTitleProps) => {
  const { children, ...textProps } = props;

  return (
    <Text
      mb={"28px"}
      color={'text_primary'}
      fontSize={'2xl'}
      fontWeight={"bold"}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default PageTitle;