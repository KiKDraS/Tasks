import { useStorageState } from "@/hooks/use-storage-state";
import { delay } from "@/utils/delay";
import { useCallback, useEffect, useMemo } from "react";

const NETWORK_DELAY_MS = 800;

function parseStoredItems<T>(rawItems: string | null): T[] {
  if (rawItems === null || rawItems === "") {
    return [];
  }

  try {
    return JSON.parse(rawItems) as T[];
  } catch {
    return [];
  }
}

export function useDB<T>(storageKey: string, initialData: T[] = []) {
  const [[isLoading, rawItems], setItems] = useStorageState(storageKey);

  const hasStoredItems = rawItems !== null && rawItems !== "";

  const items = useMemo<T[]>(() => parseStoredItems<T>(rawItems), [rawItems]);

  useEffect(() => {
    if (!hasStoredItems) {
      setItems(JSON.stringify(initialData));
    }
  }, [hasStoredItems, setItems, initialData]);

  const createItem = useCallback(
    async (item: T) => {
      await delay(NETWORK_DELAY_MS);

      setItems(JSON.stringify([...items, item]));
    },
    [items, setItems],
  );

  const readItems = useCallback(async () => {
    await delay(NETWORK_DELAY_MS);

    return hasStoredItems ? items : initialData;
  }, [hasStoredItems, initialData, items]);

  const updateItem = useCallback(
    async (predicate: (item: T) => boolean, updates: Partial<T>) => {
      await delay(NETWORK_DELAY_MS);

      const applyUpdates = (item: T) =>
        predicate(item) ? { ...item, ...updates } : item;
      setItems(JSON.stringify(items.map(applyUpdates)));
    },
    [items, setItems],
  );

  const deleteItem = useCallback(
    async (predicate: (item: T) => boolean) => {
      await delay(NETWORK_DELAY_MS);

      setItems(JSON.stringify(items.filter((item) => !predicate(item))));
    },
    [items, setItems],
  );

  const itemExists = useCallback(
    async (predicate: (item: T) => boolean) => {
      await delay(NETWORK_DELAY_MS);

      return items.some(predicate);
    },
    [items],
  );

  return useMemo(
    () => ({
      items,
      isLoading,
      createItem,
      readItems,
      updateItem,
      deleteItem,
      itemExists,
    }),
    [items, isLoading, createItem, readItems, updateItem, deleteItem, itemExists],
  );
}
