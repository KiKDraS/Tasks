import { Session } from "@/context/auth/types/Session";
import { useStorageState } from "@/hooks/use-storage-state";
import { createContext, use, useMemo, type PropsWithChildren } from "react";
import { useDB } from "./hooks/use-db";
import { delay } from "./utils/delay";

const AuthContext = createContext<{
  signIn: (session: Session) => Promise<void>;
  logIn: (session: Session) => Promise<boolean>;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
} | null>(null);

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

const NETWORK_DELAY_MS = 800;

export function SessionProvider({ children }: Readonly<PropsWithChildren>) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const { validateSession } = useDB();

  const data = useMemo(
    () => ({
      signIn: async (session: Session) => {
        await delay(NETWORK_DELAY_MS);
        setSession(JSON.stringify(session));
      },
      signOut: () => {
        setSession(null);
      },
      logIn: async (session: Session) => {
        const isValidSession = await validateSession(session);

        if (!isValidSession) {
          return false;
        }

        setSession(JSON.stringify(session));
        return true;
      },
      session: session ? JSON.parse(session) : null,
      isLoading,
    }),
    [isLoading, session, setSession, validateSession],
  );

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
