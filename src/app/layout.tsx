import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Larry Inver Wholesale | From Our Home to Yours",
  description:
    "Premium wholesale food distributor serving the Greater Philadelphia area. Meats, seafood, produce, dairy, and dry goods at wholesale prices.",
  keywords: [
    "wholesale food distributor Philadelphia",
    "restaurant food supplier near me",
    "bulk meat supplier Philadelphia",
    "food service wholesale Pennsylvania",
  ],
  openGraph: {
    title: "Larry Inver Wholesale",
    description: "Premium wholesale food — From Our Home to Yours.",
    type: "website",
    locale: "en_US",
    siteName: "Larry Inver Wholesale",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Larry Inver Wholesale",
  description:
    "Premium wholesale food distributor serving the Greater Philadelphia area.",
  url: "https://larryinverwholesale.com",
  telephone: "(215) 627-5323",
  address: {
    "@type": "PostalAddress",
    streetAddress: "939 N. 2nd Street",
    addressLocality: "Philadelphia",
    addressRegion: "PA",
    postalCode: "19123",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "16:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "06:00",
      closes: "12:00",
    },
  ],
  areaServed: {
    "@type": "City",
    name: "Philadelphia",
  },
  slogan: "From Our Home to Yours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafaf8] font-sans">
        {children}
      </body>
    </html>
  );
}
