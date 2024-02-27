"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import DataTablePagination from "@/components/data-table-pagination";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArchiveXIcon } from "lucide-react";
import { PaginationMeta } from "@/api/types";
import { useTranslations } from "next-intl";

type TablePagination = {
  state: PaginationState;
  meta?: PaginationMeta;
  onChange: OnChangeFn<PaginationState>;
};

type TableSorting = {
  state: SortingState;
  onChange: OnChangeFn<SortingState>;
};

export type DataTableProps<T> = {
  className?: string;
  data?: T[] | null;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  pagination?: TablePagination;
  sorting?: TableSorting;
};

export const DataTable = <DataType extends { id: string }>(
  props: DataTableProps<DataType>
) => {
  const { className, data, columns, pagination, sorting, isLoading } = props;

  const t = useTranslations();
  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    state: {
      // Connect pagination
      ...(pagination
        ? {
            pagination: {
              pageIndex: pagination.state.pageIndex,
              pageSize: pagination.state.pageSize,
            },
          }
        : {}),
      // Connect sorting
      ...(sorting
        ? {
            sorting: sorting.state,
          }
        : {}),
    },
    // Connect pagination
    ...(pagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          manualPagination: true,
          pageCount: Math.ceil(
            (pagination.meta?.total || 0) / (pagination.meta?.size || 0)
          ),
          onPaginationChange: pagination.onChange,
        }
      : {}),
    // Connect sorting
    ...(sorting
      ? {
          getSortedRowModel: getSortedRowModel(),
          manualSorting: true,
          onSortingChange: sorting.onChange,
        }
      : {}),
  });

  return (
    <div className={cn("relative flex flex-col rounded-md border", className)}>
      <ScrollArea className="relative max-h-full overflow-clip">
        <Table className="relative max-h-full overflow-clip">
          <TableHeader className="sticky top-0 z-10 bg-secondary outline outline-1 outline-stone-200 dark:outline-stone-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative max-h-[100vh] overflow-clip">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
            {isLoading &&
              new Array(10).fill(0).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      <div className="h-4 animate-pulse rounded-md bg-stone-300 dark:bg-stone-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {!table.getRowModel().rows?.length && !isLoading && (
        <div className="mt-auto flex flex-col items-center gap-2 opacity-50">
          <ArchiveXIcon className="h-12 w-12 opacity-50" />
          <span className="text-center">{t("table.no-rows")}</span>
        </div>
      )}
      <Separator className="mt-auto" />
      <DataTablePagination className="p-4" table={table} />
    </div>
  );
};
