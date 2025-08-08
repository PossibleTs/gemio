"use client";
import {
  Table as ChakraTable,
  Flex,
  TableColumnHeaderProps,
  TableRowProps,
  Text,
} from "@chakra-ui/react";

export type Actions =
  | "edit"
  | "delete"
  | "hashscanLink"
  | "approve"
  | "details"

type DisplayButtonRules = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in Actions]?: { field: string; matchRule: (data: any) => boolean };
};


type ColumnProps = TableColumnHeaderProps & {
  dataField: string;
  rowProps?: TableRowProps;
  itemId?: string;
  actions: Actions[];
  editData?: (id: number) => void;
  deleteData?: (id: number) => void;
  hashscanLinkData?: (id: number) => void;
  approveData?: (id: number) => void;
  detailsData?: (id: number | string) => void;
  displayButtonRules?: DisplayButtonRules;
};

const ActionsColumn = (props: ColumnProps) => {
  const { actions = [], width } = props;

  const getWidthValue = () => {
    let value = 0;
    let valueToMultiply = 1.6;
    actions.forEach((_, index) => {
      if (actions.length === 1) {
        valueToMultiply = 3
        value = 35 * (index + 1) * valueToMultiply;
      } else {
        if (index === 0) valueToMultiply = 1.2;
        value = 35 * (index + 1) * valueToMultiply;
      }
    });

    return `${value}px`;
  };
  const widthValue = getWidthValue();

  return (
    <ChakraTable.ColumnHeader
      width={width || widthValue}
      verticalAlign={"top"}
      pt={"7px"}
      {...props}
    >
      <Flex
        width={width || widthValue}
        overflow={"hidden"}
        alignItems={"center"}
      >
        <Flex>
          <Text fontWeight={700} ml={'20px'}>Ações</Text>
        </Flex>
      </Flex>
    </ChakraTable.ColumnHeader>
  );
};

export default ActionsColumn;
