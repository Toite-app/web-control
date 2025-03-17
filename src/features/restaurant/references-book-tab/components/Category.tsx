import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, PlusIcon, PencilIcon } from "lucide-react";
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";
import { useTranslations } from "next-intl";
import useDialogsStore from "@/store/dialogs-store";
import { memo } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  category: IWorkshiftPaymentCategory;
  restaurantId: string;
  isLast?: boolean;
  parentIsInactive?: boolean;
};

const RestaurantReferenceCategory = ({
  category,
  restaurantId,
  isLast,
  parentIsInactive,
}: Props) => {
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  // Category is inactive if it's directly inactive or if parent is inactive
  const isInactive = !category.isActive || parentIsInactive;

  const handleAddSubcategory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleDialog("workshiftPaymentCategory", true, {
      restaurantId,
      parentId: category.id,
      type: category.type,
    });
  };

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleDialog("workshiftPaymentCategory", true, {
      restaurantId,
      type: category.type,
      category,
    });
  };

  const renderActions = () => (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={handleEdit}>
              <PencilIcon
                className={cn("h-4 w-4", isInactive && "text-muted-foreground")}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("PaymentCategories.edit-category")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {!category.parentId && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleAddSubcategory}
              >
                <PlusIcon
                  className={cn(
                    "h-4 w-4",
                    isInactive && "text-muted-foreground"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("PaymentCategories.add-subcategory")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  const renderContent = () => {
    if (category.childrens?.length && category.childrens.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={category.id} className="border-none">
            <AccordionTrigger className="px-2 py-2 hover:no-underline [&>svg]:hidden">
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      "h-4 w-4",
                      isInactive && "text-muted-foreground"
                    )}
                  />
                  <span className={cn(isInactive && "text-muted-foreground")}>
                    {category.name}
                  </span>
                </div>
                {renderActions()}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="ml-4 flex flex-col">
                {category.childrens.map((child, index) => (
                  <RestaurantReferenceCategory
                    key={child.id}
                    category={child}
                    restaurantId={restaurantId}
                    isLast={index === category.childrens.length - 1}
                    parentIsInactive={isInactive}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className={cn(isInactive && "text-muted-foreground")}>
          {category.name}
        </span>
        {renderActions()}
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      {!isLast && <Separator className="my-1" />}
    </>
  );
};

export default memo(RestaurantReferenceCategory);
