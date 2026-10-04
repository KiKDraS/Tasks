import { Session } from "@/context/auth/types/Session";
import { useStorageState } from "@/hooks/use-storage-state";
import { useCallback, useEffect, useMemo } from "react";
import { delay } from "../utils/delay";

const USERS_DB: Session[] = [{ user: "pepe", password: "1234" }] as const;

const NETWORK_DELAY_MS = 800;

export const useDB = () => {
  const [[_, users], setUsers] = useStorageState("users");

  useEffect(() => {
    if (!users) {
      setUsers(JSON.stringify(USERS_DB));
    }
  }, [users, setUsers]);

  const validateSession = useCallback(async (session: Session) => {
    await delay(NETWORK_DELAY_MS);

    return USERS_DB.some(
      (item) =>
        item.user === session.user && item.password === session.password,
    );
  }, []);

  const storageNewSession = useCallback(
    async (session: Session) => {
      await delay(NETWORK_DELAY_MS);

      setUsers(JSON.stringify([...USERS_DB, session]));
    },
    [setUsers],
  );

  return useMemo(
    () => ({
      validateSession,
      storageNewSession,
    }),
    [validateSession, storageNewSession],
  );
};
