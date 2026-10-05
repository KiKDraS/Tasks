import { STORAGE_KEYS } from "@/constants/storage-keys";
import { Session } from "@/context/auth/types/Session";
import { useStorageState } from "@/hooks/use-storage-state";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useDB } from "../../hooks/use-db";
import { USERS_DB } from "./data/users-seed";

const AuthContext = createContext<{
  signIn: (session: Session) => Promise<void>;
  logIn: (session: Session) => Promise<boolean>;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
} | null>(null);

export function SessionProvider({ children }: Readonly<PropsWithChildren>) {
  const [[isLoading, session], setSession] = useStorageState(
    STORAGE_KEYS.session,
  );
  const { createItem: createUser, itemExists } = useDB<Session>(
    STORAGE_KEYS.users,
    USERS_DB,
  );

  const signIn = useCallback(
    async (session: Session) => {
      await createUser(session);
      setSession(JSON.stringify(session));
    },
    [createUser, setSession],
  );

  const signOut = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const logIn = useCallback(
    async (session: Session) => {
      const isValidSession = await itemExists((item) => {
        const isValidCredentials =
          item.user === session.user && item.password === session.password;
        return isValidCredentials;
      });

      if (!isValidSession) {
        return false;
      }

      setSession(JSON.stringify(session));
      return true;
    },
    [itemExists, setSession],
  );

  const data = useMemo(
    () => ({
      signIn,
      signOut,
      logIn,
      session: session ? JSON.parse(session) : null,
      isLoading,
    }),
    [signIn, signOut, logIn, session, isLoading],
  );

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}
