export enum FilterCondition {
  Equals = "equals",
  NotEquals = "notEquals",
  Contains = "contains",
  NotContains = "notContains",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
}

export type Filter<F extends string = string> = {
  field: F;
  label: string;
  conditions: FilterCondition[];
  data:
    | {
        type: "input";
      }
    | {
        type: "date";
      }
    | {
        type: "select";
        options: {
          translatePath: string;
          value: string;
        }[];
      };
};
