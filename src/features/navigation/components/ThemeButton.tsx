import { Button } from "@/components/ui/button";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { cn } from "@/lib/utils";
import { MessageCategories } from "@/messages/index.types";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { FC } from "react";

type Props = {
  showText?: boolean;
};

export const ThemeButton: FC<Props> = (props) => {
  const { showText = true } = props;

  const t = useTranslations(MessageCategories.TOITE);
  const { theme, setTheme } = useTheme();

  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-center px-4 py-2"
      suppressHydrationWarning
    >
      <Button
        className={cn(
          "flex w-full flex-row items-center justify-start gap-2",
          !showText && "justify-center"
        )}
        variant="outline"
        size="sm"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        {theme === "dark" ? (
          <>
            <SunIcon className="h-6 w-6" />
            {showText && (
              <span className="whitespace-nowrap">{t("light-mode")}</span>
            )}
          </>
        ) : (
          <>
            <MoonIcon className="h-6 w-6" />
            {showText && (
              <span className="whitespace-nowrap">{t("dark-mode")}</span>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default ThemeButton;
