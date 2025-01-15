"use client";
import { IDish, IDishImage } from "@/types/dish.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  data?: IDish;
};

export default function DishImagesTab({ data }: Props) {
  const [images, setImages] = useState<IDishImage[]>(
    (data?.images ?? []).sort((a, b) => a.sortIndex - b.sortIndex)
  );

  const t = useTranslations();

  const handleAltChange = (imageId: string, newAlt: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, alt: newAlt } : img))
    );
  };

  const handleDeleteImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

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
            <Card
              key={image.id}
              className={cn(
                "space-y-4 p-4",
                image.sortIndex === 0 && "ring-2 ring-primary"
              )}
            >
              <div className="relative aspect-video w-full">
                <img
                  src={`${image.endpoint}/${image.bucketName}/${image.id}${image.extension}`}
                  alt={image.alt}
                  className="absolute inset-0 h-full w-full rounded-md object-cover"
                />
                {image.sortIndex === 0 && (
                  <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-sm text-primary-foreground">
                    {t("Images.main-image")}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder={t("Images.image-alt")}
                  value={image.alt}
                  onChange={(e) => handleAltChange(image.id, e.target.value)}
                />
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("toite.delete")}
                </Button>
              </div>
            </Card>
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
