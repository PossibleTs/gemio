import { Box, Flex, Text } from "@chakra-ui/react";

type LabelProps = {
  labelText: string;
  required?: boolean;
}
const Label = (props: LabelProps) => {
  const { labelText, required = false} = props
  
  return (
    <Flex as="label" wrap={"unset"} gap={0.5}>
      <Text
        fontSize={{ base: "18px", mdDown: "14px", mdOnly: "14px" }}
        lineHeight={"22px"}
        mb={"14px"}
        fontWeight={700}
      >
        {labelText}
      </Text>
      {required ? (
        <Box as="span" color={"#FF0000"}>
          *
        </Box>
      ): null}
    </Flex>
  )
}

export default Label