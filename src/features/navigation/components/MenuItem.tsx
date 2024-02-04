"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FC, memo, useState } from "react";
import { MenuItem } from "../menu-items";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { MessageCategories } from "@/messages/index.types";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigationStore } from "../store";
import { cn } from "@/lib/utils";
type Props = {
  data: MenuItem;
};

const NavMenuItem: FC<Props> = (props) => {
  const { data } = props;
  const { labelId, href, icon, childrens } = data;

  const isExpandable = childrens && childrens.length > 0;

  const [isExpanded, setIsExpanded] = useState(false);

  const t = useTranslations(MessageCategories.NAVBAR);
  const { isOpen, toggle } = useNavigationStore();

  const pathname = usePathname();

  const isSelected = pathname.indexOf(href || "super") !== -1;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Link
              data-selected={isSelected}
              className={twMerge(
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                  "text-stone-500 dark:text-stone-400 dark:hover:text-stone-50",
                  "hover:bg-stone-200 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                  isSelected &&
                    "bg-primary/20 text-primary/80 dark:bg-primary/80 dark:text-stone-50",
                  isSelected &&
                    "hover:bg-primary/30 hover:text-primary/80 dark:hover:bg-primary dark:hover:text-stone-50",
                  !isOpen && "justify-center"
                )
              )}
              // @ts-ignore
              href={href || "---"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!isExpandable) return;
                if (!isOpen) {
                  toggle();
                  if (isExpanded) return;
                }

                setIsExpanded((prev) => !prev);
              }}
            >
              <div className="h-6 w-6">{icon}</div>
              {isOpen && <span>{t(labelId)}</span>}
              {isExpandable && isOpen ? (
                isExpanded ? (
                  <ChevronUpIcon className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-auto h-4 w-4" />
                )
              ) : (
                <></>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            className={cn(
              "absolute left-7 top-1 flex h-[48px] items-center justify-center whitespace-nowrap",
              isOpen && "hidden"
            )}
            align="end"
            alignOffset={-300}
          >
            {t(labelId)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isExpandable && isOpen && isExpanded ? (
        <div className="ml-4">
          {childrens?.map((child) => (
            <NavMenuItem key={child.labelId} data={child} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(NavMenuItem);
