import { getTranslations } from "next-intl/server";
import GuestOrderClient from "./GuestOrderClient";

export async function generateMetadata() {
  const t = await getTranslations("ordering");
  return {
    title: `${t("guestTitle")} | Larry Inver Wholesale`,
    description: "Place a wholesale food order without creating an account.",
  };
}

export default function GuestOrderPage() {
  return <GuestOrderClient />;
}
