import { useCallback, useEffect, useState } from "react";

type TableCollapsibleHook = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: Array<Record<string, any>>;
  itemIdField: string;
  subItemIdField: string;
};
const useTableCollapsible = (props: TableCollapsibleHook) => {
  const { dataSource, itemIdField, subItemIdField } = props;

  const [isTrigged, setIsTrigged] = useState<
    { name: string; trigged: boolean }[]
  >([]);

  const handleTrigger = (title: string) => {
    if (isTrigged.find((item) => item.name === title)) {
      handleRemove(title);
    } else {
      handleAdd(title);
    }
  };

  const handleAdd = (title: string) =>
    setIsTrigged((prev) => {
      return [
        ...prev,
        {
          name: title,
          trigged: true,
        },
      ];
    });

  const handleRemove = (title: string) =>
    setIsTrigged((prev) => {
      return prev.filter((item) => item.name !== title);
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddAll = (items: any[]) => {
    setIsTrigged(items);
  };

  const handleRemoveAll = () => setIsTrigged([]);

  const handleTriggerUpdateWhenUpdatingData = useCallback(() => {
    setIsTrigged((isTrigged) => {
      const updatedOpenedItems = isTrigged.filter((item) => {
        const isOpenAndHasSubItem = dataSource.some(
          (data) =>
            +data[itemIdField] === +item.name &&
            data[subItemIdField] &&
            data[subItemIdField].length > 0
        );

        return isOpenAndHasSubItem;
      });

      return updatedOpenedItems;
    });
  }, [dataSource, setIsTrigged, itemIdField, subItemIdField]);

  useEffect(() => {
    if (dataSource) {
      handleTriggerUpdateWhenUpdatingData();
    }
  }, [dataSource, handleTriggerUpdateWhenUpdatingData]);

  return {
    isTrigged,
    handleTrigger,
    handleAdd,
    handleRemove,
    handleAddAll,
    handleRemoveAll,
  };
};

export default useTableCollapsible;
