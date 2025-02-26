import { formatDistance } from "date-fns";
import { et, ru, enUS } from "date-fns/locale";

export default function formatTimeDistance(
  date: Date | string,
  locale: string,
  options?: {
    addSuffix?: boolean;
    now?: Date;
  }
) {
  return formatDistance(new Date(date), options?.now ?? new Date(), {
    addSuffix: options?.addSuffix ?? true,
    locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
  });
}
