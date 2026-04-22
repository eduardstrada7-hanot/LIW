import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("catalog");
  return {
    title: `${t("heading")} | Larry Inver Wholesale Foods`,
    description: t("subheading"),
  };
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
