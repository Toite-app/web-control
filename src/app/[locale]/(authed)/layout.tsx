import { FC, PropsWithChildren } from "react";
import { NavigationBar } from "../../../features/navigation";

const AuthedLayout: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="flex flex-row">
      <NavigationBar />
      <div className="relative flex min-h-screen w-full flex-col bg-primary/5 pl-20">
        {children}
      </div>
    </div>
  );
};

export default AuthedLayout;
