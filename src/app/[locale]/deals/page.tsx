import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import DealsClient from "./DealsClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("deals");
  return {
    title: `${t("heading")} | Larry Inver Wholesale Foods`,
    description: t("subheading"),
  };
}

export default function DealsPage() {
  return <DealsClient />;
}
