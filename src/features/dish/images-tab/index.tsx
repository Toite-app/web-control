"use client";
import { IDish } from "@/types/dish.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { DishImageCard } from "./dish-card";

type Props = {
  data?: IDish;
};

export default function DishImagesTab({ data }: Props) {
  const images = data?.images ?? [];

  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Input type="file" accept="image/*" className="w-full" />
          <Button>
            <ImagePlus className="mr-2 h-4 w-4" />
            {t("Images.upload")}
          </Button>
        </div>
      </Card>

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
