import { getTranslations } from "next-intl/server";
import HistoryClient from "./HistoryClient";

export async function generateMetadata() {
  const t = await getTranslations("history");
  return {
    title: `${t("heading")} | Larry Inver Wholesale`,
    description: t("subheading"),
  };
}

export default function HistoryPage() {
  return <HistoryClient />;
}
