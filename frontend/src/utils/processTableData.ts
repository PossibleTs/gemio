export type Pagination<T> = {
  page: number;
  order: keyof T;
  direction: 'asc' | 'desc';
  limitPages: number;
  totalPages: number;
};

export type SearchFilters<T> = Partial<Record<keyof T, string>>;

export function processTableData<T>(
  data: T[],
  searchFilters: Record<string, string>,
  pagination: Pagination<T> & { order: string }
): { list: T[]; totalPages: number } {

  const filteredData = data.filter((item) =>
    Object.entries(searchFilters).every(([key, filterValue]) => {
      const value = key.includes('.')
        ? getValueByPath(item, key)
        : findFirstKeyValue(item, key);

      return (
        value !== undefined &&
        String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      );
    })
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = pagination.order.includes('.')
      ? getValueByPath(a, pagination.order)
      : findFirstKeyValue(a, pagination.order);

    const valB = pagination.order.includes('.')
      ? getValueByPath(b, pagination.order)
      : findFirstKeyValue(b, pagination.order);

    const isAsc = pagination.direction === 'asc';

    if (valA == null && valB == null) return 0;
    if (valA == null) return isAsc ? 1 : -1;
    if (valB == null) return isAsc ? -1 : 1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return pagination.direction === 'asc' ? valA - valB : valB - valA;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return pagination.direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  const startIndex = (pagination.page - 1) * pagination.limitPages;
  const endIndex = startIndex + pagination.limitPages;

  const totalPages = Math.ceil(filteredData.length / pagination.limitPages);

  const list = sortedData.slice(startIndex, endIndex);

  return { list, totalPages };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findFirstKeyValue(obj: any, targetKey: string): any {
  if (typeof obj !== 'object' || obj === null) return undefined;

  if (targetKey in obj) return obj[targetKey];

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object') {
      const result = findFirstKeyValue(val, targetKey);
      if (result !== undefined) return result;
    }
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
