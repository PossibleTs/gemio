import { Flex } from "@chakra-ui/react";
import { Input } from "./input";
import { TbCalendarFilled } from "react-icons/tb";

type InputDatePickerProps = {
  openCalendar: () => void;
  value: string;
  placeholder: string
};

const InputDatePicker = (props: InputDatePickerProps) => { 
  const { openCalendar, value, placeholder } = props;

  return (
    <Flex
      onClick={openCalendar}
      rounded="sm"
      align="center"
      px={"12px 16px"}
      cursor="pointer"
      border="solid"
      borderWidth="1px"
      borderColor="input_border"
    >
      <Input
        type="text"
        name="disabled-autofill"
        autoComplete="off"
        readOnly
        value={value}
        placeholder={placeholder}
        lineHeight={"22px"}
        h="38px"
        border="none"
        outline="none"
        _focusVisible={{ boxShadow: "none" }}
        cursor="pointer"
      />
      <TbCalendarFilled size={20} color="dark_gray"/>
    </Flex>
  )
};

export default InputDatePicker;
