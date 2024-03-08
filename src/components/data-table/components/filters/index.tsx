"use client";

import { useTranslations } from "next-intl";
import { AddFilterButton } from "./components/AddButton";
import { Filter } from "./index.types";

export type DataTableFiltersProps<F extends string> = {
  config: Filter<F>[];
};

export const DataTableFilters = <F extends string>(
  props: DataTableFiltersProps<F>
) => {
  const { config } = props;

  const t = useTranslations();

  t;

  return (
    <div className="flex flex-row items-center gap-1">
      <AddFilterButton {...{ config }} />
    </div>
  );
};
