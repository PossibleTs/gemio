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

export type SelectCleanProps<TMulti extends boolean = false> = ReactSelectProps<
  OptionType,
  TMulti,
  GroupBase<OptionType>
> & {
  isMulti?: TMulti;
};

function SelectCleanInner<TMulti extends boolean = false>(
  props: SelectCleanProps<TMulti>,
  ref: React.Ref<SelectInstance<OptionType, TMulti, GroupBase<OptionType>>>
) {
  const { isMulti = false as TMulti } = props
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMenuTarget(document.body);
    }
  }, []);

  return (
    <Select
      instanceId={"select-clean"}
      isSearchable={false}
      noOptionsMessage={() => "Nenhum resultado encontrado."}
      ref={ref}
      chakraStyles={SelectCleanChakraStyles}
      menuPortalTarget={menuTarget}
      {...props}
      isMulti={isMulti}
    />
  );
};

type ForwardedSelect = <TMulti extends boolean = false>(
  props: SelectCleanProps<TMulti> & {
    ref?: React.Ref<SelectInstance<OptionType, TMulti, GroupBase<OptionType>>>;
  }
) => React.ReactElement;

const SelectClean = React.forwardRef(SelectCleanInner) as ForwardedSelect & {
  displayName?: string;
};

SelectClean.displayName = "SelectClean";

export type SelectCleanChakraStylesProps = ChakraStylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
>;
export const SelectCleanChakraStyles: SelectCleanChakraStylesProps = {
  placeholder: (provided) => ({
    ...provided,
    fontSize: { base: "14px", md: "16px" },
  }),
  valueContainer: (provided) => ({
    ...provided,
    fontSize: { base: "14px", md: "16px" },
    px: "12px",
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

export default SelectClean;
