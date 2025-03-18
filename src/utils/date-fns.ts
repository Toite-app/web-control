import { format as _format } from "date-fns";
import { et, ru, enUS } from "date-fns/locale";

export default function format(
  date: Date | string,
  formatStr: string,
  locale: string
) {
  return _format(new Date(date), formatStr, {
    locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
  });
}
