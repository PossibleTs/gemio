import { useState } from "react";

const useSearch = () => {
  const [searchFilters, setSearchFilters] = useState({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchFilters = (filters: any) =>
    setSearchFilters((prev) => ({ ...prev, ...filters }));

  const handleResetSearchFilters = () => setSearchFilters({});

  return {
    handleSearchFilters,
    handleResetSearchFilters,
    searchFilters,
  };
};

export default useSearch;
