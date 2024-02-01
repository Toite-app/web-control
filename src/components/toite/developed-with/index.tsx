import { FC } from "react";
import { ToiteLogo } from "@/components/toite/logo";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCategories } from "@/messages/index.types";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

const DevelopedWithToite: FC<Props> = (props) => {
  const { className } = props;
  const t = useTranslations(MessageCategories.TOITE);

  return (
    <div className={twMerge("flex w-full justify-center ", className)}>
      <Link
        className="flex select-none flex-row items-center gap-1 text-center text-black opacity-50 transition-all hover:opacity-80"
        href="https://github.com/toite-app"
        target="_blank"
      >
        <p className="h-4 text-sm">{t("copyright")}</p>
        <ToiteLogo className="h-4 w-10 fill-black" />
      </Link>
    </div>
  );
};

export default DevelopedWithToite;
