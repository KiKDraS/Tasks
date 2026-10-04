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
import { delay } from "./utils/delay";

const USERS_DB: Session[] = [{ user: "pepe", password: "1234" }];

const AuthContext = createContext<{
  signIn: (session: Session) => Promise<void>;
  logIn: (session: Session) => Promise<boolean>;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
} | null>(null);

const NETWORK_DELAY_MS = 800;

export function SessionProvider({ children }: Readonly<PropsWithChildren>) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const { itemExists } = useDB<Session>("users", USERS_DB);

  const signIn = useCallback(
    async (session: Session) => {
      await delay(NETWORK_DELAY_MS);
      setSession(JSON.stringify(session));
    },
    [setSession],
  );

  const signOut = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const logIn = useCallback(
    async (session: Session) => {
      const isValidSession = await itemExists(
        (item) =>
          item.user === session.user && item.password === session.password,
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
