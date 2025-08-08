import {
  InputProps,
  Input as InputCK,
  Field,
  Box,
  defineStyle,
  Text,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  { floatingPlaceholder?: string } & InputProps
>(function Input(props, ref) {
  const { floatingPlaceholder = "", placeholder = "", type, ...rest } = props;

  const onBeforeInput = (e: FormEvent<HTMLInputElement>) => {
    if (type === "number") {
      const newValue = (e as unknown as { data: string }).data.replace(
        /\D/g,
        ""
      );
      if (!newValue) e.preventDefault();
    }
  };

  return (
    <Field.Root>
      <Box pos="relative" w="full">
        <InputCK
          type={type}
          display={"block"}
          width={"100%"}
          ref={ref}
          className="peer"
          placeholder={placeholder}
          onBeforeInput={onBeforeInput}
          
          {...rest}
        />
        <Field.Label css={floatingStyles}>
          <Text
            fontSize={"10.29px"}
            lineHeight={"18.1px"}
            color={"dark"}
            textTransform={"uppercase"}
          >
            {floatingPlaceholder}
          </Text>
        </Field.Label>
      </Box>
    </Field.Root>
  );
});

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "2",
  top: "2",
  insetStart: "2",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "position",
  _peerPlaceholderShown: {
    color: "fg.muted",
    top: "6",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "fg",
    top: "2",
    insetStart: "2",
  },
});
