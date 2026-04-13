import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Match all paths except admin, api, _next static, and files with extensions
    "/((?!admin-liwsecure|api|_next|_vercel|.*\\..*).*)",
  ],
};
