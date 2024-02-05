import { FC } from "react";
import { ToiteLogo } from "../logo";

type Props = {
  show?: boolean;
};

export const ToiteLoader: FC<Props> = (props) => {
  const { show = true } = props;

  return (
    <div
      data-show={show}
      className="group absolute left-0 top-0 z-50 flex h-[100vh] w-full items-center justify-center overflow-clip border-b-2 border-stone-200 bg-stone-50 transition-all duration-200 ease-in-out data-[show=false]:h-0 data-[show=false]:border-0 dark:border-stone-800 dark:bg-stone-900"
    >
      <ToiteLogo className="h-36 w-36 dark:invert" />
    </div>
  );
};
