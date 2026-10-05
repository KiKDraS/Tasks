import AsyncStorage from "@react-native-async-storage/async-storage";
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

async function readStorageItemAsync(
  key: string,
): Promise<StorageValue<string>> {
  return AsyncStorage.getItem(key);
}

async function setStorageItemAsync(
  key: string,
  value: StorageValue<string>,
) {
  if (value == null) {
    await AsyncStorage.removeItem(key);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    void readStorageItemAsync(key).then((value) => {
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
