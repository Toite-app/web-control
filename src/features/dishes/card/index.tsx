import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IDish } from "@/types/dish.types";
import { Clock, Scale, Box } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  data: IDish;
};

export default function DishCard(props: Props) {
  const { className, data } = props;
  const t = useTranslations("dish-card");

  return (
    <Card
      className={cn("flex h-auto flex-row items-center gap-2 p-2", className)}
    >
      <img
        className="h-14 max-h-14 w-14 max-w-14"
        src="https://hinkali.city/_next/image?url=%2Fimages%2Fhinkali.png&w=1920&q=75"
        alt=""
      />
      <div className="flex w-full flex-col gap-2">
        <span className="text-lg font-bold">{data.name}</span>
        <div className="flex flex-row gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Box className="h-4 w-4" />
            <span className="whitespace-nowrap">
              {data.amountPerItem} {t("pieces")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="whitespace-nowrap">
              {data.cookingTimeInMin} {t("minutes")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            <span className="whitespace-nowrap">
              {data.weight}{" "}
              {t(data.weightMeasure === "grams" ? "grams" : "milliliters")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
