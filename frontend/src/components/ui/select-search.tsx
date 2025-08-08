"use client";
import {
  Select,
  ChakraStylesConfig,
  SelectInstance,
} from "chakra-react-select";
import React, { useEffect, useState } from "react";
import { Props as ReactSelectProps, GroupBase } from "react-select";

export type OptionType = {
  label: string;
  value: string;
  colorPalette?: string;
};

type SelectSearchProps = ReactSelectProps<
  OptionType,
  false,
  GroupBase<OptionType>
> & {
  inputWidth?: string;
};

const SelectSearch = React.forwardRef<
  SelectInstance<OptionType, false, GroupBase<OptionType>>,
  SelectSearchProps
>(({ inputWidth = "100%", ...props }, ref) => {
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMenuTarget(document.parentElement);
    }
  }, []);

  return (
    <Select
      instanceId={"select-search"}
      noOptionsMessage={() => "Nenhum resultado encontrado."}
      ref={ref}
      chakraStyles={{
        ...SelectSearchChakraStyles,
        input: (provided, state) => ({
          ...(SelectSearchChakraStyles.input
            ? SelectSearchChakraStyles.input(provided, state)
            : provided),
          width: {base: '100%', sm: inputWidth},
        }),
      }}
      menuPortalTarget={menuTarget}
      {...props}
    />
  );
});

SelectSearch.displayName = "SelectSearch";

export type SelectSearchChakraStylesProps = ChakraStylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
>;
export const SelectSearchChakraStyles: SelectSearchChakraStylesProps = {
  placeholder: (provided) => ({
    ...provided,
    fontSize: { base: "14px", md: "16px" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    fontSize: { base: "14px", md: "16px" },
    px: "12px"
  }),
  input: (provided) => ({
    ...provided,
  }),
  container: (provided) => ({
    ...provided,
    outlineStyle: "none",
  }),
  control: (provided) => ({
    ...provided,
    borderColor: "input_border",
    outline: "none",
    overflow: "hidden",
    cursor: "context-menu",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "dark_gray",
    paddingInline: 0,
    pr: "12px",
  }),
  menu: (provided) => ({
    ...provided,
    margin: 0,
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    m: 0,
    border: "1px solid var(--chakra-colors-input_border)",
    borderTopWidth: 0,
  }),
  option: (provided) => ({
    ...provided,
    borderRadius: "none",
    fontSize: { base: "14px", md: "16px" },
    px: "15px",
    py: "12px",
    backgroundColor: "#FFF",
    _hover: {
      backgroundColor: "secondary",
      color: "#F9F6EF",
    },
    color: "text_primary",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    borderRadius: "none",
    fontSize: { base: "14px", md: "16px" },
    px: "15px",
    py: "12px",
    color: "text_primary",
  }),
};

export default SelectSearch;
