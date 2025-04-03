"use client";

import { Card } from "@/components/ui/card";
import { DiscountFormValues } from "@/features/discount/discount-form";
import { useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale, useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import format from "@/utils/date-fns";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { findOrCreateGuestMutation } from "@/api/fetch/guests/findOrCreate";

export default function DiscountGuestsCard() {
  const t = useTranslations();
  const locale = useLocale();
  const handleError = useErrorHandler();

  const [phone, setPhone] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { watch, setValue } = useFormContext<DiscountFormValues>();

  const guests = watch("guests");

  const existGuest = useMemo(() => {
    return guests.find((guest) => guest.phone === phone);
  }, [guests, phone]);

  const handleAddGuest = async () => {
    if (existGuest) return;

    setIsSubmiting(true);

    try {
      const guestsMap = new Map(guests.map((guest) => [guest.phone, guest]));

      if (guestsMap.has(phone)) return;

      const guest = await findOrCreateGuestMutation({
        data: {
          phone,
        },
      });

      guestsMap.set(guest.phone, {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        createdAt: new Date(),
      });

      setValue("guests", Array.from(guestsMap.values()));
      setPhone("");
    } catch (error) {
      handleError({ error });
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-4 py-0">
      <Accordion type="single" collapsible defaultValue="guests">
        <AccordionItem className="border-b-0" value="guests">
          <AccordionTrigger className="border-b-0">
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-bold">
                {t("Discounts.form.guests")}
              </h2>
              <p className="text-sm text-stone-500">
                {t("Discounts.form.guests-description")}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <div className="flex flex-col gap-4">
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <PhoneInput
                    className="w-full"
                    placeholder={t("Discounts.form.enter-guest-phone")}
                    value={phone}
                    onChange={setPhone}
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleAddGuest}
                    disabled={isSubmiting || phone.length === 0 || !!existGuest}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="ml-2">
                      {t("Discounts.form.add-guest")}
                    </span>
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("fields.name")}</TableHead>
                      <TableHead>{t("fields.phone")}</TableHead>
                      <TableHead>
                        {t("Discounts.form.guest-added-at")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.length > 0 ? (
                      guests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium">
                            {guest.name}
                          </TableCell>
                          <TableCell>{guest.phone}</TableCell>
                          <TableCell>
                            {format(
                              new Date(guest.createdAt),
                              "dd.MM.yyyy",
                              locale
                            )}
                          </TableCell>
                          <TableCell className="max-w-10">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const guestsMap = new Map(
                                  guests.map((guest) => [guest.phone, guest])
                                );
                                guestsMap.delete(guest.phone);
                                setValue(
                                  "guests",
                                  Array.from(guestsMap.values())
                                );
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="py-4 text-center text-muted-foreground"
                        >
                          {t("table.no-rows")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
