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

type AuthContextValue = {
  registerUser: (session: Session) => Promise<boolean>;
  signIn: (session: Session) => Promise<boolean>;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const hasValidCredentials = (item: Session, session: Session) =>
  item.user === session.user && item.password === session.password;

export function SessionProvider({ children }: Readonly<PropsWithChildren>) {
  const [[isLoading, session], setSession] = useStorageState(
    STORAGE_KEYS.session,
  );
  const { createItem: createUser, itemExists } = useDB<Session>(
    STORAGE_KEYS.users,
    USERS_DB,
  );

  const registerUser = useCallback(
    async (session: Session) => {
      const isUserTaken = await itemExists(
        (item) => item.user === session.user,
      );
      if (isUserTaken) {
        return false;
      }

      await createUser(session);
      setSession(JSON.stringify(session));
      return true;
    },
    [createUser, itemExists, setSession],
  );

  const signOut = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const signIn = useCallback(
    async (session: Session) => {
      const isValidSession = await itemExists((item) =>
        hasValidCredentials(item, session),
      );

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
      registerUser,
      signOut,
      signIn,
      session: session ? JSON.parse(session) : null,
      isLoading,
    }),
    [registerUser, signOut, signIn, session, isLoading],
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
