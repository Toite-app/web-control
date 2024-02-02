import { FC, PropsWithChildren } from "react";

const FormLayout: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/60 to-primary/20 ">
      <div className="flex min-w-32 flex-col gap-4 bg-white p-8 shadow-2xl">
        {children}
      </div>
    </main>
  );
};

export default FormLayout;
