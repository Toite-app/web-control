import { DataTableFilters } from "@/components/data-table/components/filters";
import {
  Filter,
  FilterCondition,
} from "@/components/data-table/components/filters/index.types";
import { IGuest } from "@/types/guest.types";
import { FC, useMemo } from "react";

type Props = any;

export const GuestsTableFilters: FC<Props> = (props) => {
  const {} = props;

  const config = useMemo<Filter<keyof IGuest>[]>(
    () => [
      {
        field: "name",
        label: "fields.name",
        conditions: Object.values(FilterCondition),
        data: {
          type: "input",
        },
      },
      {
        field: "phone",
        label: "fields.phone",
        conditions: Object.values(FilterCondition),
        data: {
          type: "input",
        },
      },
      {
        field: "email",
        label: "fields.email",
        conditions: Object.values(FilterCondition),
        data: {
          type: "input",
        },
      },
    ],
    []
  );

  return <DataTableFilters {...{ config }} />;
};
