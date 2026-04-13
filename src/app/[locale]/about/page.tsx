import { getTranslations } from "next-intl/server";
import AboutClient from "./AboutClient";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return {
    title: `${t("heading")} | Larry Inver Wholesale`,
    description: t("missionBody"),
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
