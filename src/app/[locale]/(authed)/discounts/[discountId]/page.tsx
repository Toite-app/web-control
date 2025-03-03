import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";

import { getTranslations } from "next-intl/server";
import Content from "./content";

export const generateMetadata = async (
  props: IntlPageParams<{ orderId: string }>
) => {
  const {
    params: { locale },
  } = props;

  const tNav = await getTranslations({
    locale,
    namespace: MessageCategories.NAVBAR,
  });

  return {
    title: `${tNav("discount")} / ${TOITE_CONFIG.appName}`,
  };
};

const DiscountPage = (props: IntlPageParams<{ discountId: string }>) => {
  const {
    params: { discountId },
  } = props;

  return (
    <>
      <Content discountId={discountId} />
    </>
  );
};

export default DiscountPage;
