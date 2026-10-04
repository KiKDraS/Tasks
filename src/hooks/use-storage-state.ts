import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

type StorageValue<T> = T | null;
type StorageState<T> = [boolean, StorageValue<T>];
type UseStateHook<T> = [StorageState<T>, (value: StorageValue<T>) => void];

function useAsyncState<T>(
  initialValue: StorageState<T> = [true, null],
): UseStateHook<T> {
  const [state, setState] = useState<StorageState<T>>(initialValue);
  const setValue = useCallback((value: StorageValue<T>) => {
    setState([false, value]);
  }, []);
  return [state, setValue];
}

export async function setStorageItemAsync(
  key: string,
  value: StorageValue<string>,
) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    void SecureStore.getItemAsync(key).then((value: StorageValue<string>) => {
      setState(value);
    });
  }, [key, setState]);

  const setValue = useCallback(
    (value: StorageValue<string>) => {
      setState(value);
      void setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}
