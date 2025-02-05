"use client";

import { useTranslations } from "next-intl";
import { OrderStatus } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ClipboardList,
  ChefHat,
  CheckCircle2,
  CreditCard,
  Flag,
  Truck,
  XCircle,
} from "lucide-react";

type StepperItem = {
  status: OrderStatus;
  icon: React.ComponentType<{ className?: string }>;
};

const BASE_STEPPER_ITEMS: StepperItem[] = [
  {
    status: "pending",
    icon: ClipboardList,
  },
  {
    status: "cooking",
    icon: ChefHat,
  },
  {
    status: "ready",
    icon: CheckCircle2,
  },
  {
    status: "paid",
    icon: CreditCard,
  },
  {
    status: "completed",
    icon: Flag,
  },
];

// Function to get stepper items with delivery status inserted at correct position
const getStepperItems = (
  currentStatus: OrderStatus,
  statusDates: Partial<Record<OrderStatus, Date>>
): StepperItem[] => {
  const items = [...BASE_STEPPER_ITEMS];

  // Helper function to safely get date
  const getDateValue = (date: Date | undefined) => {
    if (!date) return 0;
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  };

  // Handle delivery status
  if (currentStatus === "delivering" || statusDates?.delivering) {
    const deliveryItem: StepperItem = {
      status: "delivering",
      icon: Truck,
    };

    const paidIndex = items.findIndex((item) => item.status === "paid");

    if (statusDates?.paid && statusDates?.delivering) {
      if (
        getDateValue(statusDates.delivering) < getDateValue(statusDates.paid)
      ) {
        items.splice(paidIndex, 0, deliveryItem);
      } else {
        items.splice(paidIndex + 1, 0, deliveryItem);
      }
    } else if (statusDates?.paid) {
      items.splice(paidIndex + 1, 0, deliveryItem);
    } else {
      items.splice(paidIndex, 0, deliveryItem);
    }
  }

  // Handle cancelled status
  if (currentStatus === "cancelled" || statusDates?.cancelled) {
    const cancelledItem: StepperItem = {
      status: "cancelled",
      icon: XCircle,
    };

    // Find the latest date from statusDates
    const dates = Object.entries(statusDates)
      .filter(([status]) => status !== "cancelled")
      .map(([status, date]) => ({ status, date }))
      .filter(({ date }) => date !== null && date !== undefined);

    if (dates.length > 0) {
      const sortedDates = dates.sort(
        (a, b) => getDateValue(b.date) - getDateValue(a.date)
      );
      const latestStatus = sortedDates[0].status;
      const statusIndex = items.findIndex(
        (item) => item.status === latestStatus
      );
      items.splice(statusIndex + 1, 0, cancelledItem);
    } else {
      // If no dates available, add cancelled at the end
      items.push(cancelledItem);
    }
  }

  return items;
};

const getStepStatus = (
  currentStatus: OrderStatus,
  stepStatus: OrderStatus,
  stepperItems: StepperItem[]
): "completed" | "current" | "upcoming" | "cancelled" => {
  const statusOrder = stepperItems.map((item) => item.status);
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepStatus);

  // If order is cancelled, mark steps differently based on their position
  if (currentStatus === ("cancelled" as OrderStatus)) {
    // Find the index where cancellation was inserted
    const cancelIndex = statusOrder.indexOf("cancelled" as OrderStatus);

    // If step is before or at the last completed step before cancellation
    if (stepIndex < cancelIndex) {
      return "completed";
    }
    // If it's the cancelled step itself
    if (stepIndex === cancelIndex) {
      return "current";
    }
    // All steps after cancellation
    return "upcoming";
  }

  // Normal status flow
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
};

type Props = {
  currentStatus: OrderStatus;
  statusDates?: Partial<Record<OrderStatus, Date>>;
};

export default function OrderStepper({
  currentStatus,
  statusDates = {},
}: Props) {
  const t = useTranslations();
  const stepperItems = getStepperItems(currentStatus, statusDates);

  return (
    <div className="flex flex-col">
      {stepperItems.map((item, index) => {
        const stepStatus = getStepStatus(
          currentStatus,
          item.status,
          stepperItems
        );
        const Icon = item.icon;
        const date = statusDates[item.status];

        return (
          <div key={item.status} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  {
                    "border-primary bg-primary":
                      (stepStatus === "completed" ||
                        stepStatus === "current") &&
                      currentStatus !== ("cancelled" as OrderStatus),
                    "border-muted-foreground": stepStatus === "upcoming",
                    "border-destructive bg-destructive":
                      currentStatus === ("cancelled" as OrderStatus) &&
                      (stepStatus === "completed" || stepStatus === "current"),
                  }
                )}
              >
                <Icon
                  className={cn("h-5 w-5", {
                    "text-primary-foreground":
                      (stepStatus === "completed" ||
                        stepStatus === "current") &&
                      currentStatus !== ("cancelled" as OrderStatus),
                    "text-muted-foreground": stepStatus === "upcoming",
                    "text-destructive-foreground":
                      currentStatus === ("cancelled" as OrderStatus) &&
                      (stepStatus === "completed" || stepStatus === "current"),
                  })}
                />
              </div>
              {index < stepperItems.length - 1 && (
                <div className="h-6 w-[2px] bg-border">
                  <div
                    className={cn("h-full w-full", {
                      "bg-primary":
                        stepStatus === "completed" &&
                        currentStatus !== ("cancelled" as OrderStatus),
                      "bg-muted": stepStatus === "upcoming",
                      "bg-destructive":
                        currentStatus === ("cancelled" as OrderStatus) &&
                        stepStatus === "completed",
                    })}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col pb-1">
              <span
                className={cn("text-lg font-medium", {
                  "text-primary":
                    (stepStatus === "completed" || stepStatus === "current") &&
                    currentStatus !== ("cancelled" as OrderStatus),
                  "text-muted-foreground": stepStatus === "upcoming",
                  "text-destructive":
                    currentStatus === ("cancelled" as OrderStatus) &&
                    (stepStatus === "completed" || stepStatus === "current"),
                })}
              >
                {t(`OrderCard.statuses.general.${item.status}`)}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-muted-foreground">
                  {t(`Order.stepper.${item.status}`)}
                </span>
                {stepStatus === "current" ? (
                  <span
                    className={cn("text-sm font-medium", {
                      "text-primary":
                        currentStatus !== ("cancelled" as OrderStatus),
                      "text-destructive":
                        currentStatus === ("cancelled" as OrderStatus),
                    })}
                  >
                    {t("Order.current")}
                  </span>
                ) : (
                  date && (
                    <span className="text-sm text-muted-foreground">
                      {format(date, "dd.MM.yyyy HH:mm")}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
