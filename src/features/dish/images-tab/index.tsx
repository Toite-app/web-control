"use client";
import { IDish } from "@/types/dish.types";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { DishImageCard } from "./dish-card";
import { UploadCard } from "./upload-card";

type Props = {
  data?: IDish;
};

export default function DishImagesTab({ data }: Props) {
  const images = data?.images ?? [];
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <UploadCard dishId={data?.id ?? ""} />

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <DishImageCard key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            {t("Images.no-images")}
          </div>
        </Card>
      )}
    </div>
  );
}
