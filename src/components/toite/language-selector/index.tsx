"use client";
import { FC, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US, RU, EE } from "country-flag-icons/react/3x2";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

const LanguageSelector: FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = useCallback(
    (locale: string) => {
      router.replace(pathname, {
        locale,
      });
    },
    [router, pathname]
  );

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-max">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <div className="flex flex-row items-center gap-2">
            <US className="w-5" />
            <p>English</p>
          </div>
        </SelectItem>
        <SelectItem value="ru">
          <div className="flex flex-row items-center gap-2">
            <RU className="w-5" />
            <p>Русский</p>
          </div>
        </SelectItem>
        <SelectItem value="ee">
          <div className="flex flex-row items-center gap-2">
            <EE className="w-5" />
            <p>Eesti</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
