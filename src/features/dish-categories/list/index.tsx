"use client";
import { Card } from "@/components/ui/card";
import { useGetDishCategories } from "@/api/fetch/dish-categories/useGetDishCategories";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, GripVertical } from "lucide-react";
import { IDishCategory } from "@/types/dish-category.types";
import useDialogsStore from "@/store/dialogs-store";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { putDishCategoryMutation } from "@/api/fetch/dish-categories/putDishCategory";
import { SortOrder } from "@/components/data-table/hooks/useSorting";

interface SortableItemProps {
  category: IDishCategory;
}

function SortableItem({ category }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex w-full items-center gap-2 rounded-md hover:bg-accent hover:text-accent-foreground",
        isDragging && "opacity-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 hover:text-accent-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 py-2">{category.name}</span>
    </div>
  );
}

type Props = {
  className?: string;
};

export default function DishCategoriesList(props: Props) {
  const { className } = props;
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const { data } = useGetDishCategories({
    params: {
      size: 100,
      sortBy: "sortIndex",
      sortOrder: SortOrder.ASC,
    },
    config: {
      keepPreviousData: true,
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !data?.data) return;

    const oldIndex = data.data.findIndex((item) => item.id === active.id);
    const newIndex = data.data.findIndex((item) => item.id === over.id);

    const movedItem = data.data[oldIndex];
    const targetItem = data.data[newIndex];

    // Only update the two affected items
    await Promise.all([
      putDishCategoryMutation({
        urlValues: { categoryId: movedItem.id },
        data: { sortIndex: targetItem.sortIndex },
      }),
      putDishCategoryMutation({
        urlValues: { categoryId: targetItem.id },
        data: { sortIndex: movedItem.sortIndex },
      }),
    ]);
  };

  return (
    <Card className={cn("flex w-full flex-col gap-2 p-4", className)}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">{t("DishCategories.title")}</p>
        </div>
        <Button
          size="icon-sm"
          variant="default"
          onClick={() => {
            toggleDialog("dishCategory", true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-0">
        {!data?.data?.length ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              {t("table.loading")}
            </p>
          </div>
        ) : data?.data?.length && data.data.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              {t("table.no-rows")}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.data}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-1 py-1">
                {data.data.map((category) => (
                  <SortableItem key={category.id} category={category} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </ScrollArea>
    </Card>
  );
}
