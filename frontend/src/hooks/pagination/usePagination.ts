import constants from "@app/constants";
import handleErrorMessage from "@app/utils/handleErrorMessage";
import { useState } from "react";

type UsePaginationProps = {
  totalPages: number;
  count?: number;
  order: string;
  direction?: "asc" | "desc";
};
const usePagination = (props: UsePaginationProps) => {
  const {
    count,
    totalPages,
    order: defaultOrder,
    direction: defaultDirection = "desc",
  } = props;
  const [page, setPage] = useState(constants.pagination.INITIAL_PAGE);
  const [limitPages, setLimitPages] = useState(constants.pagination.LIMIT_PAG);
  const [order, setOrder] = useState(defaultOrder);
  const [direction, setDirection] = useState(defaultDirection);

  const handleToPage = (page: number) => {
    try {
      setPage(page);
    } catch (err) {
      handleErrorMessage(err);
    }
  };

  const handlePreviousPage = () => {
    try {
      const newPage = page > 1 ? page - 1 : constants.pagination.INITIAL_PAGE;
      setPage(newPage);
    } catch (err) {
      handleErrorMessage(err);
    }
  };

  const handleNextPage = () => {
    try {
      const newPage = page >= totalPages ? page : page + 1;
      setPage(newPage);
    } catch (err) {
      handleErrorMessage(err);
    }
  };

  const handleLimitPage = (limit: number) => setLimitPages(limit);

  const handleOrder = (orderParam: string) => {
    if (orderParam === order)
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));

    setOrder(orderParam);
  };

  return {
    page,
    count,
    order,
    direction,
    totalPages,
    limitPages,
    handleToPage,
    handlePreviousPage,
    handleNextPage,
    handleLimitPage,
    handleOrder,
  };
};

export default usePagination;
