import { IntlPageParams } from "@/types/i18n.types";
import { unstable_setRequestLocale } from "next-intl/server";
import { FC, PropsWithChildren } from "react";

const FormLayout: FC<PropsWithChildren & IntlPageParams> = (props) => {
  const {
    children,
    params: { locale },
  } = props;

  unstable_setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/60 to-primary/20 ">
      <div className="flex min-w-32 flex-col gap-4 bg-white p-8 shadow-2xl dark:bg-stone-900">
        {children}
      </div>
    </main>
  );
};

export default FormLayout;
