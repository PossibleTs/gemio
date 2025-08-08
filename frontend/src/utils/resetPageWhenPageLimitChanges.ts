import { useState } from "react";
import constants from "@app/constants";

type PaginationType = {
  limitPages: number;
  handleToPage: (page: number) => void;
};

const useResetPageWhenPageLimitChanges = (pagination: PaginationType) => {
  const [prevLimitPages, setPrevLimitPages] = useState(constants.pagination.LIMIT_PAG);
  
  if (pagination.limitPages !== prevLimitPages) {
    pagination.handleToPage(1);
    setPrevLimitPages(pagination.limitPages);
  }
};

export default useResetPageWhenPageLimitChanges;