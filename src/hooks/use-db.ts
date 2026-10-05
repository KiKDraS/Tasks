import { useStorageState } from "@/hooks/use-storage-state";
import { delay } from "@/utils/delay";
import { useCallback, useEffect, useMemo } from "react";

const NETWORK_DELAY_MS = 800;

export function useDB<T>(dbName: string, initialData: T[] = []) {
  const [[isLoading, rawItems], setItems] = useStorageState(dbName);

  const items = useMemo<T[]>(() => {
    if (!rawItems) {
      return [];
    }
    try {
      return JSON.parse(rawItems) as T[];
    } catch {
      return [];
    }
  }, [rawItems]);

  useEffect(() => {
    if (!rawItems) {
      setItems(JSON.stringify(initialData));
    }
  }, [rawItems, setItems, initialData]);

  const createItem = useCallback(
    async (item: T) => {
      await delay(NETWORK_DELAY_MS);

      setItems(JSON.stringify([...items, item]));
    },
    [items, setItems],
  );

  const readItems = useCallback(async () => {
    await delay(NETWORK_DELAY_MS);

    return items;
  }, [items]);

  const updateItem = useCallback(
    async (predicate: (item: T) => boolean, updates: Partial<T>) => {
      await delay(NETWORK_DELAY_MS);

      setItems(
        JSON.stringify(
          items.map((item) => (predicate(item) ? { ...item, ...updates } : item)),
        ),
      );
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
