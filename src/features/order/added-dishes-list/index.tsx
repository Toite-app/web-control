import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SearchIcon,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  SearchX,
  PlusIcon,
} from "lucide-react";
import { IOrder } from "@/types/order.types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import useDebouncedValue from "@/hooks/use-debounced-value";
import AddedOrderDishRow from "./components/AddedOrderDishRow";

type Props = {
  order?: IOrder | null;
};

type SortField = "name" | "status" | "quantity" | "price";
type SortOrder = "asc" | "desc";

export default function AddedDishesList({ order }: Props) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "desc") {
        setSortField("name");
        setSortOrder("asc");
      } else {
        setSortOrder("desc");
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const filteredDishes = useMemo(() => {
    if (!order?.orderDishes) return [];

    const filtered = order.orderDishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        dish.isRemoved === false
    );

    return filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;

      switch (sortField) {
        case "name":
          return multiplier * a.name.localeCompare(b.name);
        case "status":
          return multiplier * a.status.localeCompare(b.status);
        case "quantity":
          return multiplier * (a.quantity - b.quantity);
        case "price":
          return (
            multiplier *
            (Number(a.finalPrice) * a.quantity -
              Number(b.finalPrice) * b.quantity)
          );
        default:
          return 0;
      }
    });
  }, [order?.orderDishes, debouncedSearch, sortField, sortOrder]);

  if (!order) {
    return (
      <Card className="flex w-full flex-col gap-2 p-4">
        <h2 className="text-xl font-semibold">{t("AddedDishesList.list")}</h2>
        <Separator className="mb-2" />
        <p className="py-4 text-center text-muted-foreground">
          {t("AddedDishesList.noAddedDishes")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex w-full flex-col p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">{t("AddedDishesList.list")}</h2>
        <div className="relative w-[300px]">
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={t("AddedDishesList.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Separator className="mt-2" />
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead
              className="min-w-[100px] cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                {t("AddedDishesList.dishName")}
                {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                {t("AddedDishesList.status")}
                {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("quantity")}
            >
              <div className="flex items-center gap-1">
                {t("AddedDishesList.quantity")}
                {getSortIcon("quantity")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center gap-1">
                {t("AddedDishesList.price")}
                {getSortIcon("price")}
              </div>
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDishes.length > 0 ? (
            filteredDishes.map((orderDish) => (
              <AddedOrderDishRow
                key={orderDish.id}
                orderDish={orderDish}
                order={order}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={5} className="h-[400px]">
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  {debouncedSearch.length > 0 ? (
                    <SearchX className="h-12 w-12" />
                  ) : (
                    <PlusIcon className="h-12 w-12" />
                  )}
                  <p className="text-lg font-medium">
                    {t(
                      debouncedSearch.length > 0
                        ? "AddedDishesList.noFilteredDishes"
                        : "AddedDishesList.noDishes"
                    )}
                  </p>
                  <p className="text-sm">
                    {t(
                      debouncedSearch.length > 0
                        ? "AddedDishesList.tryDifferentSearch"
                        : "AddedDishesList.pleaseAddDishes"
                    )}
                  </p>
                </div>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
