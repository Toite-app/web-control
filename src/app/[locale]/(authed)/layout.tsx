import { FC, PropsWithChildren } from "react";
import { NavigationBar } from "../../../features/navigation";
import AuthGuard from "@/features/guards/auth";

const AuthedLayout: FC<PropsWithChildren> = async (props) => {
  const { children } = props;

  return (
    <AuthGuard>
      <div className="flex flex-row">
        <NavigationBar />
        <div className="relative flex min-h-screen w-full flex-col bg-stone-100 dark:bg-stone-900">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AuthedLayout;
