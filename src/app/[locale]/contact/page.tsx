import { getTranslations } from "next-intl/server";
import ContactClient from "./ContactClient";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return {
    title: `${t("heading")} | Larry Inver Wholesale`,
    description: t("subheading"),
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
