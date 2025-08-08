import { Box, Flex, Text } from "@chakra-ui/react";
import SelectClean, { OptionType } from "./select-clean";
import useLimitPage from "@app/hooks/pagination/useLimitPage";
import { SingleValue } from "chakra-react-select";

type LimitPageProps = {
  limit: string;
  handleLimitPage: (limit: number) => void;
};
const LimitPage = (props: LimitPageProps) => {
  const { limit, handleLimitPage: handle } = props;
  const { handleLimitPage } = useLimitPage({ limit, handle });

  const handleChangeSelectValue = (e: SingleValue<OptionType>) => {
    if (!e) return;
    handleLimitPage(+e.value);
  };

  return (
    <Box>
      <Flex alignItems={"center"}>
        <Box mr={"10px"}>
          <SelectClean
            options={LIMIT_PAGE_OPTIONS}
            defaultValue={LIMIT_PAGE_OPTIONS.find((el) => el.value === limit)}
            onChange={(e) => handleChangeSelectValue(e)}
          />
        </Box>
        <Box>
          <Text
            textWrap={"nowrap"}
            color={"text_primary"}
            opacity={0.6}
            fontSize={"12px"}
          >
            Resultados por página
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

const LIMIT_PAGE_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
];

export default LimitPage;
