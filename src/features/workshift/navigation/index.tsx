"use client";

import { useGetWorkshiftNav } from "@/api/fetch/workshifts/useGetWorkshiftNav";
import { Link } from "@/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  workshiftId: string;
};

export default function WorkshiftNavigation(props: Props) {
  const { workshiftId } = props;

  const t = useTranslations();

  const workshiftNav = useGetWorkshiftNav({
    urlValues: {
      workshiftId,
    },
  });

  return (
    <div className="flex w-full flex-row items-center rounded-xl bg-stone-50 dark:bg-stone-900">
      <Link
        className="w-full"
        href={{
          pathname: "/workshifts/[workshiftId]",
          params: {
            workshiftId: String(workshiftNav.data?.prevId),
          },
        }}
      >
        <button
          className="flex w-full items-center justify-center border border-primary p-2 text-primary hover:bg-accent disabled:border-muted-foreground disabled:text-muted-foreground disabled:hover:bg-transparent"
          disabled={!workshiftNav.data?.prevId}
        >
          <span className="flex flex-row items-center gap-4">
            <ChevronLeftIcon className="h-5 w-5" />
            {t("workshifts.prev")}
          </span>
        </button>
      </Link>
      <Link
        className="w-full"
        href={{
          pathname: "/workshifts/[workshiftId]",
          params: {
            workshiftId: String(workshiftNav.data?.nextId),
          },
        }}
      >
        <button
          className="flex w-full items-center justify-center border border-l-0 border-primary p-2 text-primary hover:bg-accent disabled:border-muted-foreground disabled:text-muted-foreground disabled:hover:bg-transparent"
          disabled={!workshiftNav.data?.nextId}
        >
          <span className="flex flex-row items-center gap-4">
            {t("workshifts.next")}
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        </button>
      </Link>
    </div>
  );
}
