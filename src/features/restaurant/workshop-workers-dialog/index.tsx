import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetWorkshopWorkers } from "@/features/restaurant/api/useGetWorkshopWorkers";
import { putWorkshopWorkersMutation } from "@/features/restaurant/api/putWorkshopWorkers";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export type WorkshopWorkersDialogProps = {
  data: {
    restaurantId: string;
    workshopId: string;
  };
  open?: boolean;
  onClose?: () => void;
};

const WorkshopWorkersDialog = (props: WorkshopWorkersDialogProps) => {
  const { data, open, onClose } = props;
  const { restaurantId, workshopId } = data;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  const { data: workersData, isLoading } = useGetWorkers({
    params: {
      restaurantIds: [restaurantId],
    },
    skip: !restaurantId,
  });

  const { data: workshopWorkers, isLoading: isLoadingWorkshopWorkers } =
    useGetWorkshopWorkers({
      urlValues: {
        restaurantId,
        workshopId,
      },
      skip: !restaurantId || !workshopId,
    });

  const handleSubmit = async () => {
    try {
      await putWorkshopWorkersMutation({
        urlValues: {
          restaurantId,
          workshopId,
        },
        data: {
          workerIds: selectedWorkers,
        },
      });

      toast({
        title: t("RestaurantWorkshops.workers-dialog.success"),
        description: t(
          "RestaurantWorkshops.workers-dialog.success-description"
        ),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error });
    }
  };

  useEffect(() => {
    if (open && workshopWorkers) {
      setSelectedWorkers(workshopWorkers.map((worker) => worker.workerId));
    }
  }, [open, workshopWorkers]);

  const isLoaderVisible = isLoading || isLoadingWorkshopWorkers;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("RestaurantWorkshops.workers-dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            {t("RestaurantWorkshops.workers-dialog.description")}
          </p>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {isLoaderVisible ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {t("table.loading")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workersData?.data.map((worker) => (
                  <div key={worker.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={worker.id}
                      checked={selectedWorkers.includes(worker.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedWorkers((prev) => [...prev, worker.id]);
                        } else {
                          setSelectedWorkers((prev) =>
                            prev.filter((id) => id !== worker.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={worker.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {worker?.name ?? worker?.login} (
                      {t(`roles.${worker?.role}`)})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="h-10 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            {t("RestaurantWorkshops.workers-dialog.submit")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(WorkshopWorkersDialog);
