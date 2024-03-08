import { DataTableFilters } from "@/components/data-table/components/filters";
import {
  Filter,
  FilterCondition,
} from "@/components/data-table/components/filters/index.types";
import { IWorker, WorkerRole } from "@/types/worker.types";
import { FC, useMemo } from "react";

type Props = any;

export const WorkersTableFilters: FC<Props> = (props) => {
  const {} = props;

  const config = useMemo<Filter<keyof IWorker>[]>(
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
        field: "login",
        label: "fields.login",
        conditions: Object.values(FilterCondition),
        data: {
          type: "input",
        },
      },
      {
        field: "role",
        label: "fields.role",
        conditions: [FilterCondition.Equals, FilterCondition.NotEquals],
        data: {
          type: "select",
          options: Object.values(WorkerRole).map((role) => ({
            translatePath: `roles.${role}`,
            value: role,
          })),
        },
      },
    ],
    []
  );

  return <DataTableFilters {...{ config }} />;
};
