"use client";
import { Card } from "@/components/ui/card";
import { useGetDishCategories } from "@/api/fetch/dish-categories/useGetDishCategories";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon } from "lucide-react";
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
import { buildFiltersParam } from "@/lib/filters";

interface SortableItemProps {
  category: IDishCategory;
}

function SortableItem({ category }: SortableItemProps) {
  const toggleDialog = useDialogsStore((state) => state.toggle);

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
        "group flex w-full items-center justify-between gap-2 rounded-md pl-2 hover:bg-accent hover:text-accent-foreground",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex-1 py-2" {...attributes} {...listeners}>
        {category.name}
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            toggleDialog("dishCategory", true, {
              menuId: category.menuId,
              dishCategory: category,
            })
          }
          className="mr-2"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  menuId?: string | null;
};

export default function DishCategoriesList(props: Props) {
  const { className, menuId } = props;
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const { data } = useGetDishCategories({
    params: {
      size: 100,
      sortBy: "sortIndex",
      sortOrder: SortOrder.ASC,
      ...(menuId && {
        filters: buildFiltersParam([
          {
            field: "menuId",
            condition: "equals",
            value: menuId ?? "",
          },
        ]),
      }),
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
        {menuId && (
          <Button
            size="icon-sm"
            variant="default"
            onClick={() => {
              toggleDialog("dishCategory", true, {
                menuId,
              });
            }}
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-0">
        {!data?.data ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              {t("table.loading")}
            </p>
          </div>
        ) : data.data.length === 0 ? (
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
