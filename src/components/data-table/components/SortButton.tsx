import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { PropsWithChildren } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortButtonProps<D, V> = PropsWithChildren & {
  className?: string;
  column: Column<D, V>;
};

export const SortButton = <D, V>(props: SortButtonProps<D, V>) => {
  const { className, children, column } = props;

  const sortOrder = column.getIsSorted();

  return (
    <Button
      className={cn("p-0 text-left", className)}
      variant="text"
      onClick={() => {
        if (sortOrder === "desc") {
          return column.clearSorting();
        }

        column.toggleSorting(sortOrder === "asc");
      }}
    >
      {children}
      {sortOrder === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {sortOrder === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
      {!sortOrder && <ArrowUpDown className="ml-2 h-4 w-4" />}
    </Button>
  );
};
