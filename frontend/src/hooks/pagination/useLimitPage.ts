import constants from "@app/constants";
import { useState } from "react";

type UseLimitPageProps = {
  limit?: string;
  handle: (limit: number) => void;
};
const useLimitPage = (props: UseLimitPageProps) => {
  const { limit, handle } = props;
  const [pageLimit, setPageLimit] = useState(
    limit ? limit : constants.pagination.LIMIT_PAG.toString()
  );

  const handleLimitPage = (limit: number) => {
    setPageLimit(limit.toString());
    handle(limit);
  };
  return { handleLimitPage, pageLimit };
};

export default useLimitPage;
