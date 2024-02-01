import { FC, PropsWithChildren } from "react";

const FormLayout: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <main className="from-brand-primary-600 to-brand-secondary-400 flex min-h-screen flex-col items-center justify-center gap-2 bg-gradient-to-br ">
      <div className="flex min-w-32 flex-col gap-4 bg-white p-8 shadow-2xl">
        {children}
      </div>
    </main>
  );
};

export default FormLayout;
