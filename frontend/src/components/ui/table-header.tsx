import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
};
const TableHeader = (props: TableHeaderProps) => (
  <Box mb={"30px"}>
    <Flex
      alignItems={{
        base: "center",
        mdDown: "flex-start",
        mdOnly: "flex-start",
      }}
      flexWrap={"wrap"}
      gap={{ base: 0, mdDown: "14px", mdOnly: "14px" }}
      justifyContent={"space-between"}
      flexDirection={{ base: "row", mdOnly: "row" }}
    >
      {props.children}
    </Flex>
  </Box>
);

export default TableHeader;
