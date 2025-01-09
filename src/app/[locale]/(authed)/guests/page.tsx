import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";

import { getTranslations } from "next-intl/server";
import GuestsPageContent from "./content";

export const generateMetadata = async (props: IntlPageParams) => {
  const {
    params: { locale },
  } = props;

  const tNav = await getTranslations({
    locale,
    namespace: MessageCategories.NAVBAR,
  });

  return {
    title: `${tNav("guests")} / ${TOITE_CONFIG.appName}`,
  };
};

const GuestsPage = () => {
  return <GuestsPageContent />;
};

export default GuestsPage;
