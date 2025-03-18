import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";

import { getTranslations } from "next-intl/server";
import WorkshiftPageContent from "./content";

export const generateMetadata = async (
  props: IntlPageParams<{ workshiftId: string }>
) => {
  const {
    params: { locale },
  } = props;

  const tNav = await getTranslations({
    locale,
    namespace: MessageCategories.NAVBAR,
  });

  return {
    title: `${tNav("workshift")} / ${TOITE_CONFIG.appName}`,
  };
};

const WorkshiftPage = (props: IntlPageParams<{ workshiftId: string }>) => {
  const {
    params: { workshiftId },
  } = props;

  return <WorkshiftPageContent workshiftId={workshiftId} />;
};

export default WorkshiftPage;
