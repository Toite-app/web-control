import { useGetRestaurantWorkshiftPaymentCategories } from "@/api/fetch/restaurants/workshift-payment-categories/useGetRestaurantWorkshiftPaymentCategories";
import {
  IRestaurant,
  WorkshiftPaymentCategoryType,
} from "@/types/restaurant.types";
import { useTranslations } from "next-intl";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  PlusIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import useDialogsStore from "@/store/dialogs-store";
import RestaurantReferenceCategory from "./components/Category";

type Props = {
  restaurant?: IRestaurant;
};

const LoadingCard = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </CardTitle>
      <Skeleton className="h-8 w-8 rounded-md" />
    </CardHeader>
    <Separator />
    <CardContent className="px-2 py-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </CardContent>
  </Card>
);

const RestaurantReferencesBookTab = ({ restaurant }: Props) => {
  const t = useTranslations();
  const { data: paymentCategories, isLoading } =
    useGetRestaurantWorkshiftPaymentCategories({
      urlValues: {
        restaurantId: String(restaurant?.id),
      },
      config: { keepPreviousData: true },
      skip: !restaurant?.id,
    });
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const categoriesByType = {
    [WorkshiftPaymentCategoryType.INCOME]:
      paymentCategories?.filter(
        (category) => category.type === WorkshiftPaymentCategoryType.INCOME
      ) ?? [],
    [WorkshiftPaymentCategoryType.EXPENSE]:
      paymentCategories?.filter(
        (category) => category.type === WorkshiftPaymentCategoryType.EXPENSE
      ) ?? [],
    [WorkshiftPaymentCategoryType.CASHLESS]:
      paymentCategories?.filter(
        (category) => category.type === WorkshiftPaymentCategoryType.CASHLESS
      ) ?? [],
  };

  const typeIcons = {
    [WorkshiftPaymentCategoryType.INCOME]: (
      <ArrowUpCircle className="h-5 w-5 text-green-500" />
    ),
    [WorkshiftPaymentCategoryType.EXPENSE]: (
      <ArrowDownCircle className="h-5 w-5 text-red-500" />
    ),
    [WorkshiftPaymentCategoryType.CASHLESS]: (
      <CreditCard className="h-5 w-5 text-blue-500" />
    ),
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(categoriesByType).map(([type, categories]) => (
        <Card key={type}>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <CardTitle className="flex items-center gap-2">
              {typeIcons[type as WorkshiftPaymentCategoryType]}
              <span className="text-xl">
                {t(`PaymentCategories.types.${type}`)}
              </span>
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => {
                      toggleDialog("workshiftPaymentCategory", true, {
                        restaurantId: String(restaurant?.id),
                        type: type as WorkshiftPaymentCategoryType,
                      });
                    }}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("PaymentCategories.add-category")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <Separator />
          <CardContent className="px-2">
            {categories.length > 0 ? (
              <div className="flex flex-col">
                {categories.map((category, index) => (
                  <RestaurantReferenceCategory
                    key={category.id}
                    category={category}
                    restaurantId={String(restaurant?.id)}
                    isLast={index === categories.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Wallet className="mb-2 h-12 w-12" />
                <p>{t("PaymentCategories.no-categories")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantReferencesBookTab;
