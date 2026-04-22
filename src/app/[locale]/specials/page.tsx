import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SpecialsClient from "./SpecialsClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("specials");
  return {
    title: `${t("heading")} | Larry Inver Wholesale Foods`,
    description: t("subheading"),
  };
}

export default function SpecialsPage() {
  return <SpecialsClient />;
}
