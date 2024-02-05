"use client";
import { useRouter } from "@/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { useSession } from "./hooks/useSession";
import { ToiteLoader } from "@/components/toite/loader";

type Props = PropsWithChildren;

const AuthGuard: FC<Props> = (props) => {
  const { children } = props;

  const router = useRouter();
  const session = useSession();

  // TODO: FIX UNHANDLED LOGOUT CASE WHEN REDIRECT DOESN'T WORK

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "error" || session.status === "unauthenticated") {
      return router.push("/sign-in");
    }
  }, [router, session]);

  const isGranted = !(session.status === "loading" || !session.data);

  return (
    <>
      <ToiteLoader show={!isGranted} />
      {isGranted && children}
    </>
  );
};

export default AuthGuard;
