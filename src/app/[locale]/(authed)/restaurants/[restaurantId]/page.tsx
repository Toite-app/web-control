import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";

import { getTranslations } from "next-intl/server";
import { RestaurantPageContent } from "./content";

export const generateMetadata = async (
  props: IntlPageParams<{ restaurantId: string }>
) => {
  const {
    params: { locale },
  } = props;

  const tNav = await getTranslations({
    locale,
    namespace: MessageCategories.NAVBAR,
  });

  return {
    title: `${tNav("restaurants")} / ${TOITE_CONFIG.appName}`,
  };
};

const RestaurantPage = (props: IntlPageParams<{ restaurantId: string }>) => {
  const {
    params: { restaurantId },
  } = props;

  return <RestaurantPageContent restaurantId={restaurantId} />;
};

export default RestaurantPage;
