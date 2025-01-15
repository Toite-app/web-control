import { IDishImage } from "@/types/dish.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, FileType, HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import formatFileSize from "@/utils/format-file-size";

interface DishImageCardProps {
  image: IDishImage;
}

export function DishImageCard({ image }: DishImageCardProps) {
  const t = useTranslations();

  const handleDelete = () => {
    console.log("delete");
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <Card
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileType className="h-4 w-4" />
            {image.mimeType}
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" />
            {formatFileSize(image.size)}
          </div>
        </div>
        <Input
          placeholder={t("Images.image-alt")}
          value={image.alt}
          onChange={(e) => handleAltChange(e)}
        />
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => handleDelete()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("toite.delete")}
        </Button>
      </div>
    </Card>
  );
}
