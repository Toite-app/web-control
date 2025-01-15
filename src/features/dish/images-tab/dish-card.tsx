import { IDishImage } from "@/types/dish.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, FileType, HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import formatFileSize from "@/utils/format-file-size";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { updateDishImageMutation } from "@/api/fetch/dishes/images/put-dish-image";
import { deleteDishImageMutation } from "@/api/fetch/dishes/images/delete-dish-image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DishImageCardProps {
  dishId: string;
  image: IDishImage;
  index: number;
}

export function DishImageCard({ dishId, image, index }: DishImageCardProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const [isDeleting, setIsDeleting] = useState(false);
  const [altText, setAltText] = useState(image.alt);
  const debouncedAltText = useDebouncedValue(altText, 1_500);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDishImageMutation({
        urlValues: {
          dishId,
          imageId: image.id,
        },
      });

      toast({
        title: t("Images.delete-success"),
        description: t("Images.delete-success-description"),
        variant: "success",
      });
    } catch (error) {
      handleError({ error });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAltChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
  };

  // Effect to handle debounced alt text updates
  useEffect(() => {
    const updateAlt = async () => {
      if (debouncedAltText === image.alt) return;

      try {
        await updateDishImageMutation({
          urlValues: {
            dishId,
            imageId: image.id,
          },
          data: {
            alt: debouncedAltText,
          },
        });

        toast({
          title: t("Images.alt-update-success"),
          description: t("Images.alt-update-success-description"),
          variant: "success",
        });
      } catch (error) {
        handleError({ error });
        // Reset to original value on error
        setAltText(image.alt);
      }
    };

    updateAlt();
  }, [debouncedAltText, image.alt, image.id, dishId]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(isDragging && "opacity-50")}
    >
      <Card
        className={cn("space-y-4 p-4", index === 0 && "ring-2 ring-primary")}
      >
        <div className="relative aspect-video w-full">
          <img
            src={`${image.endpoint}/${image.bucketName}/${image.id}${image.extension}`}
            alt={altText}
            className="absolute inset-0 h-full w-full rounded-md object-cover"
          />
          {index === 0 && (
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
            value={altText}
            onChange={handleAltChange}
          />
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? t("Images.deleting") : t("toite.delete")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
