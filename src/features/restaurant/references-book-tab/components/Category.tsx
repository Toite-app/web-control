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
import { ChevronRight, PlusIcon } from "lucide-react";
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";
import { useTranslations } from "next-intl";
import useDialogsStore from "@/store/dialogs-store";
import { memo } from "react";
import { Separator } from "@/components/ui/separator";

type Props = {
  category: IWorkshiftPaymentCategory;
  restaurantId: string;
  isLast?: boolean;
};

const RestaurantReferenceCategory = ({
  category,
  restaurantId,
  isLast,
}: Props) => {
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const handleAddSubcategory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleDialog("workshiftPaymentCategory", true, {
      restaurantId,
      parentId: category.id,
      type: category.type,
    });
  };

  const renderContent = () => {
    if (category.childrens?.length && category.childrens.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={category.id} className="border-none">
            <AccordionTrigger className="px-2 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleAddSubcategory}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("PaymentCategories.add-subcategory")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
        <span>{category.name}</span>
        {!category.parentId && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleAddSubcategory}
                >
                  <PlusIcon className="h-4 w-4" />
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
  };

  return (
    <>
      {renderContent()}
      {!isLast && <Separator className="my-1" />}
    </>
  );
};

export default memo(RestaurantReferenceCategory);
