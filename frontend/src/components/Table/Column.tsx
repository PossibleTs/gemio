"use client";
import useTable from "@app/hooks/table/useTable";
import {
  Box,
  Table as ChakraTable,
  Flex,
  Input,
  TableColumnHeaderProps,
  TableRowProps,
  Text,
} from "@chakra-ui/react";
import { Roboto } from "next/font/google";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import SelectClean, {
  SelectCleanChakraStyles,
  SelectCleanChakraStylesProps,
} from "../ui/select-clean";
import constants from "@app/constants";

type ColumnProps = TableColumnHeaderProps & {
  caption: string;
  dataField: string;
  disableSearch?: boolean;
  rowProps?: TableRowProps;
  itemId?: string;
  handleOrder?: (order: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSearchFilters?: (filters: any) => void;
  inputType?: "text" | "date";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ValueComponent?: React.ComponentType<{ value: any }>;
  isStatus?: boolean;
  statusOptions?: {
    label: string;
    value: string;
  }[];
  orderAndFilterField?: string;
  clearSearchField?: string
};

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const Column = (props: ColumnProps) => {
  const {
    caption,
    disableSearch = false,
    handleOrder,
    dataField,
    order,
    handleSearchFilters,
    inputType = "text",
    width,
    isStatus,
    statusOptions = constants.statusOptions.STATUS_OPTIONS_DEFAULT,
    orderAndFilterField,
    clearSearchField = ''
  } = props;

  const {
    widthValue,
    showClearFilterButton,
    handleClickClearFilterButton,
    handleBlurInput,
    filterValue,
    setFilterValue,
    onKeyDown,
    statusValue,
    handleChangeSelectStatusValue,
  } = useTable({ dataField, handleSearchFilters, inputType, clearSearchField });

  const orderField = orderAndFilterField ? orderAndFilterField : dataField;

  return (
    <ChakraTable.ColumnHeader
      width={width || widthValue || "auto"}
      verticalAlign={"top"}
      textWrap={"nowrap"}
      px={"20px"}
      pb={"14px"}
      pt={"7px"}
      {...props}
    >
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        width={width || widthValue || "auto"}
        overflowX={"unset"}
      >
        <Flex
          mb={"17px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          columnGap={3}
        >
          <Text fontWeight={700}>{caption}</Text>
          {handleOrder ? (
            <HiOutlineSwitchVertical
              size={20}
              color={
                order === orderField
                  ? 'rgba(0, 0, 0, 1)'
                  : "#28282899"
              }
              cursor={"pointer"}
              onClick={() => handleOrder(orderField)}
            />
          ) : null}
        </Flex>
        <Flex alignItems={"center"} justifyContent={"space-between"} gap={2}>
          {!disableSearch && (
            <Input
              _placeholder={{
                color: "#28282899",
              }}
              type={inputType}
              className={roboto.className}
              fontSize={"12px"}
              height={"30px"}
              padding={"12px 16px"}
              placeholder="Pesquisar"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onBlur={(e) => handleBlurInput(e)}
              onKeyDown={onKeyDown}
            />
          )}
          {isStatus && (
            <SelectClean
              disabled={false}
              chakraStyles={SelectStyles}
              options={statusOptions}
              value={statusValue}
              onChange={handleChangeSelectStatusValue}
            />
          )}
          {showClearFilterButton && (
            <Box onClick={handleClickClearFilterButton} cursor={"pointer"}>
              <IoMdClose size={16} />
            </Box>
          )}
        </Flex>
      </Flex>
    </ChakraTable.ColumnHeader>
  );
};

const SelectStyles: SelectCleanChakraStylesProps = {
  ...SelectCleanChakraStyles,
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingInline: 0,
  }),
  control: (provided) => ({
    ...provided,
    minHeight: "30px",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "12px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    fontSize: "12px",
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "12px",
    backgroundColor: "#FFF",
    _hover: {
      backgroundColor: "secondary",
      color: "#F9F6EF",
    },
    color: "darkest",
    whiteSpace: "normal",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "12px",
  }),
};

export default Column;
