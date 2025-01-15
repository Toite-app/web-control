"use client";
import { IDish } from "@/types/dish.types";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { DishImageCard } from "./dish-card";
import { UploadCard } from "./upload-card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { updateDishImageMutation } from "@/api/fetch/dishes/images/put-dish-image";

type Props = {
  data?: IDish;
};

export default function DishImagesTab({ data }: Props) {
  const images = data?.images ?? [];
  const t = useTranslations();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !data?.id) return;

    // const oldIndex = images.findIndex((item) => item.id === active.id);
    const newIndex = images.findIndex((item) => item.id === over.id);

    // Update only the moved item's sortIndex
    await updateDishImageMutation({
      urlValues: {
        dishId: data.id,
        imageId: active.id as string,
      },
      data: {
        sortIndex: newIndex + 1,
      },
    });
  };

  return (
    <div className="space-y-6">
      <UploadCard dishId={data?.id ?? ""} />

      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <DishImageCard
                  key={image.id}
                  dishId={data?.id ?? ""}
                  image={image}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
