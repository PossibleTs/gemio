import { OptionType } from "@app/components/ui/select-clean";
import moment from "moment";
import { FocusEvent, KeyboardEvent, useState } from "react";
import { MultiValue, SingleValue } from "chakra-react-select";
import constants from "@app/constants";

type TableHook = {
  dataField: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSearchFilters?: (filters: any) => void;
  inputType?: "text" | "date";
  clearSearchField?: string
};
const useTable = (props: TableHook) => {
  const { dataField = "", inputType, handleSearchFilters, clearSearchField = '' } = props;

  const [filterValue, setFilterValue] = useState("");
  const [showClearFilterButton, setShowClearFilterButton] = useState(false);
  const [statusValue, setStatusValue] = useState<SingleValue<OptionType> | MultiValue<OptionType>>(
    constants.statusOptions.STATUS_OPTIONS_DEFAULT[0]
  );

  const getWidthValue = () => {
    if (dataField?.includes("id")) {
      return "80px";
    } else if (
      dataField?.includes("created_at") ||
      dataField?.includes("updated_at")
    ) {
      return "150px";
    } else if (
      dataField?.includes("status") ||
      dataField?.includes("is_active")
    ) {
      return "80px";
    } else {
      return null;
    }
  };
  const widthValue = getWidthValue();

  const handleClickClearFilterButton = () => {
    if (clearSearchField) {
      handleSearchFilters?.({
        [clearSearchField]: "",
      });  
    } else {
      handleSearchFilters?.({
        [dataField]: "",
      });
    }
    setFilterValue("");
    setShowClearFilterButton(false);
  };

  const searchFilters = (value: string | string[]) => {
    handleSearchFilters?.({
      [dataField]:
        inputType === "date" && value
          ? moment(value).format("YYYY-MM-DD")
          : value,
    });
  };

  const handleBlurInput = (e: FocusEvent<HTMLInputElement, Element>) => {
    searchFilters(e.target.value);

    if (!e.target.value) {
      setFilterValue("");
      setShowClearFilterButton(false);
    } else {
      setShowClearFilterButton(true);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toUpperCase() === "ENTER") {
      const value = e.currentTarget.value;
      searchFilters(value);

      if (!value) {
        setFilterValue("");
        setShowClearFilterButton(false);
      } else {
        setShowClearFilterButton(true);
      }
    }
  };

  const handleChangeSelectStatusValue = (data: SingleValue<OptionType> | MultiValue<OptionType>) => {
    setStatusValue(data);

    if (Array.isArray(data)) {
      const values = data.map(option => option.value);
      searchFilters(values);
    } else if (data && typeof data === "object" && "value" in data) {
      const value = data.value;
      searchFilters(value);
    } else {
      searchFilters("");
    }
  };

  return {
    widthValue,
    filterValue,
    showClearFilterButton,
    handleClickClearFilterButton,
    handleBlurInput,
    setFilterValue,
    searchFilters,
    onKeyDown,
    statusValue,
    setStatusValue,
    handleChangeSelectStatusValue,
  };
};

export default useTable;
