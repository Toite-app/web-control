"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { FC } from "react";
import { useTranslations } from "next-intl";
import { MessageCategories } from "@/messages/index.types";
import Balancer from "react-wrap-balancer";
import { useSession } from "@/features/guards/hooks/useSession";
import { logoutMutation } from "@/api/mutate/logout";

type Props = {
  fullWidth?: boolean;
};

export const LogoutButton: FC<Props> = (props) => {
  const { fullWidth } = props;

  const { mutate } = useSession();
  const t = useTranslations(MessageCategories.TOITE);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={cn(!fullWidth && "ml-auto", fullWidth && "w-full")}
            variant="outline"
            size="sm"
          >
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>{t("logout")}</DialogTitle>
            <DialogDescription>
              <Balancer>{t("logout-text")}</Balancer>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => {
                logoutMutation().finally(() => {
                  mutate();
                });
              }}
            >
              {t("submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
