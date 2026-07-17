"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Barlow_Condensed, Rubik, Open_Sans, Poppins } from "next/font/google";

// ✅ Font setup
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-rubik",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const FONT_VARS = `${barlowCondensed.variable} ${rubik.variable} ${openSans.variable} ${poppins.variable}`;

const F = {
  barlow: barlowCondensed.className,
  rubik:  rubik.className,
  openSans: openSans.className,
};

/* ─────────────────────────────────────────────
   MINIMAL CSS — only things Tailwind can't do:
   animations, scrollbar hiding, mosaic-card
   class used by vanilla JS, pseudo-elements,
   and scroll-anim transitions.
───────────────────────────────────────────── */
const MINIMAL_CSS = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .anim-up   { animation: slideUp .7s cubic-bezier(.4,0,.2,1) both; }
  .anim-up-2 { animation: slideUp .7s .15s cubic-bezier(.4,0,.2,1) both; }
  .anim-up-3 { animation: slideUp .7s .3s cubic-bezier(.4,0,.2,1) both; }
  .dd-fade   { animation: fadeIn .15s ease both; }

  .txt-fade { transition: opacity 0.45s ease, transform 0.45s ease; }
  .txt-enter { opacity: 0 !important; transform: translateY(14px) !important; }
  .txt-visible { opacity: 1; transform: translateY(0); }

  .scroll-anim   { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .scroll-anim.in-view { opacity: 1; transform: translateY(0); }
  .scroll-anim-2 { opacity: 0; transform: translateY(20px); transition: opacity 0.6s 0.12s ease, transform 0.6s 0.12s ease; }
  .scroll-anim-2.in-view { opacity: 1; transform: translateY(0); }
  .scroll-anim-3 { opacity: 0; transform: translateY(20px); transition: opacity 0.6s 0.24s ease, transform 0.6s 0.24s ease; }
  .scroll-anim-3.in-view { opacity: 1; transform: translateY(0); }

  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* Mosaic cards — built by vanilla JS, need these classes */
  .mosaic-card { position: absolute; width: 180px; height: 200px; border-radius: 14px; overflow: hidden; cursor: grab; will-change: transform; background: #fff; border: 1px solid #ebebeb; }
  @media (min-width: 640px) { .mosaic-card { width: 200px; height: 200px; } }
  .mosaic-card img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; display: block; }
  .mosaic-card-label { position: absolute; bottom: 0; left: 0; right: 0; height: 28%; display: flex; align-items: center; padding: 0 10px; background: #fff; border-top: 1px solid #ebebeb; }
  .mosaic-card-label span { color: #1a1a1a; font-family: var(--font-open-sans), sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; line-height: 1.3; pointer-events: none; }

  /* tl-steps pseudo line */
  .tl-steps { position: relative; }
  .tl-steps::before { content: ''; position: absolute; left: 13px; top: 8px; bottom: 8px; width: 1px; background: rgba(0,0,0,0.08); }

  /* ind-dcard left accent */
  .ind-dcard { position: relative; overflow: hidden; }
  .ind-dcard::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #a10000; opacity: 0; transition: opacity 0.2s; }
  .ind-dcard:hover::before { opacity: 1; }

  /* show-more expanded chevron */
  .show-more-btn svg { transition: transform 0.3s; }
  .show-more-btn.expanded svg { transform: rotate(180deg); }

  /* reveal-on-scroll — each section gets its own entrance direction */
  .rv { opacity: 0; transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1); will-change: opacity, transform; }
  .rv.in { opacity: 1; transform: none; }
  .rv-up    { transform: translateY(48px); }
  .rv-down  { transform: translateY(-48px); }
  .rv-left  { transform: translateX(-56px); }
  .rv-right { transform: translateX(56px); }
  .rv-scale { transform: scale(.9); }
  .rv-blur  { transform: translateY(28px); filter: blur(8px); }
  .rv-blur.in { filter: blur(0); }
  .rv-d1 { transition-delay: .1s; }
  .rv-d2 { transition-delay: .2s; }
  .rv-d3 { transition-delay: .3s; }

  /* staggered children */
  .rv-stagger > * { opacity: 0; transform: translateY(40px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
  .rv-stagger.in > * { opacity: 1; transform: none; }
  .rv-stagger.in > *:nth-child(1) { transition-delay: .05s; }
  .rv-stagger.in > *:nth-child(2) { transition-delay: .15s; }
  .rv-stagger.in > *:nth-child(3) { transition-delay: .25s; }
  .rv-stagger.in > *:nth-child(4) { transition-delay: .35s; }
  .rv-stagger.in > *:nth-child(5) { transition-delay: .45s; }
  .rv-stagger.in > *:nth-child(6) { transition-delay: .55s; }
`;

/* ─────────────────────────────────────────────
   DATA  (unchanged)
───────────────────────────────────────────── */
const PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=360&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=360&fit=crop&crop=face",
];

const COUNTRIES = ["ALL","NL","FR","ES","BG","CH","DE","HU","IT","BE","AE","SI","SK","HR","SA","JP","TR","DK","UA","GR","US","UK","AU","IE","CZ"];

const countryNames: Record<string, string> = {
  ALL:"All Regions", NL:"Netherlands", FR:"France", ES:"Spain", BG:"Bulgaria",
  CH:"Switzerland", DE:"Germany", HU:"Hungary", IT:"Italy", BE:"Belgium",
  AE:"UAE / Middle East", SI:"Slovenia", SK:"Slovakia", HR:"Croatia",
  SA:"Saudi Arabia", JP:"Japan", TR:"Turkey", DK:"Denmark", UA:"Ukraine",
  GR:"Greece", US:"United States", UK:"United Kingdom", AU:"Australia",
  IE:"Ireland", CZ:"Czech Republic",
};

const countryFlag: Record<string, string> = {
  NL:"nl", FR:"fr", ES:"es", BG:"bg", CH:"ch", DE:"de",
  HU:"hu", IT:"it", BE:"be", AE:"ae", SI:"si", SK:"sk",
  HR:"hr", SA:"sa", JP:"jp", TR:"tr", DK:"dk", UA:"ua",
  GR:"gr", US:"us", UK:"gb", AU:"au", IE:"ie", CZ:"cz",
};

interface Platform { name: string; country: string; image: string; }

const platforms: Platform[] = [
  { name: "Carrefour",        country: "ES", image: "/images/Platform Logos/Carrefour.png" },
  { name: "Conforama",        country: "FR", image: "/images/Platform Logos/conforama.png" },
  { name: "Brico Depot",      country: "ES", image: "/images/Platform Logos/brico depot.png" },
  { name: "Pccomp",           country: "SK", image: "/images/Platform Logos/pc.png" },
  { name: "Planeta Huerto",   country: "ES", image: "/images/Platform Logos/mano.png" },
  { name: "Sprinter",         country: "ES", image: "/images/Platform Logos/sprinter.png" },
  { name: "Tiendanimal",      country: "ES", image: "/images/Platform Logos/tiendanimal.png" },
  { name: "KIABI",            country: "FR", image: "/images/Platform Logos/kiabi.png" },
  { name: "MANOMANO",         country: "FR", image: "/images/Platform Logos/mano.png" },
  { name: "MIRAVIA",          country: "ES", image: "/images/Platform Logos/miravia.png" },
  { name: "Leroy Merlin",     country: "FR", image: "/images/Platform Logos/leroy.png" },
  { name: "CDON",             country: "DK", image: "/images/Platform Logos/cdon.png" },
  { name: "FYNDIQ",           country: "DK", image: "/images/Platform Logos/fyndiq.png" },
  { name: "Altex",            country: "BG", image: "/images/Platform Logos/altex.png" },
  { name: "CEL",              country: "BG", image: "/images/Platform Logos/cel.png" },
  { name: "Okazii",           country: "BG", image: "/images/Platform Logos/okazii.png" },
  { name: "Public",           country: "GR", image: "/images/Platform Logos/public.png" },
  { name: "Vivre",            country: "BG", image: "/images/Platform Logos/vivre.png" },
  { name: "Worten",           country: "ES", image: "/images/Platform Logos/worten.png" },
  { name: "ClubeFashion",     country: "ES", image: "/images/Platform Logos/club.png" },
  { name: "Sport Zone",       country: "ES", image: "/images/Platform Logos/sportzone.png" },
  { name: "KuantoKusta",      country: "ES", image: "/images/Platform Logos/kuanto.png" },
  { name: "Decathlon",        country: "FR", image: "/images/Platform Logos/decathlon.png" },
  { name: "Brico",            country: "BE", image: "/images/Platform Logos/brico.png" },
  { name: "Inno",             country: "BE", image: "/images/Platform Logos/inno.png" },
  { name: "FNAC",             country: "BE", image: "/images/Platform Logos/fnac.png" },
  { name: "Hubo",             country: "BE", image: "/images/Platform Logos/hubo.png" },
  { name: "KAUFLAND",         country: "DE", image: "/images/Platform Logos/kaufland.png" },
  { name: "OTTO",             country: "DE", image: "/images/Platform Logos/otto.png" },
  { name: "Check 24",         country: "DE", image: "/images/Platform Logos/check24.png" },
  { name: "Newegg",           country: "US", image: "/images/Platform Logos/newegg.png" },
  { name: "eBay",             country: "US", image: "/images/Platform Logos/ebay.png" },
  { name: "Houzz",            country: "US", image: "/images/Platform Logos/houzz.png" },
  { name: "Kroger",           country: "US", image: "/images/Platform Logos/kroger.png" },
  { name: "Macys",            country: "US", image: "/images/Platform Logos/macys.png" },
  { name: "SEARS",            country: "US", image: "/images/Platform Logos/sears.png" },
  { name: "Overstock",        country: "US", image: "/images/Platform Logos/overstock.png" },
  { name: "RetailCloud",      country: "US", image: "/images/Platform Logos/retailcloud.png" },
  { name: "Temu",             country: "US", image: "/images/Platform Logos/temu.png" },
  { name: "WALMART",          country: "US", image: "/images/Platform Logos/walmart.png" },
  { name: "Shein",            country: "US", image: "/images/Platform Logos/shein.png" },
  { name: "WISH",             country: "US", image: "/images/Platform Logos/wish.png" },
  { name: "BUNNINGS",         country: "AU", image: "/images/Platform Logos/bunnings.png" },
  { name: "Catch of the Day", country: "AU", image: "/images/Platform Logos/catch.png" },
  { name: "Barbequesgalore",  country: "AU", image: "/images/Platform Logos/galore.png" },
  { name: "Harvey Norman",    country: "AU", image: "/images/Platform Logos/harveynorman.png" },
  { name: "OZSALE",           country: "AU", image: "/images/Platform Logos/oz.png" },
  { name: "Conrad",           country: "DE", image: "/images/Platform Logos/conrad.png" },
  { name: "Metro",            country: "DE", image: "/images/Platform Logos/metro.png" },
  { name: "MediaMarkt",       country: "DE", image: "/images/Platform Logos/media.png" },
  { name: "HOOD",             country: "DE", image: "/images/Platform Logos/hood.png" },
  { name: "YATEGO",           country: "DE", image: "/images/Platform Logos/yatego.png" },
  { name: "PRAXIS",           country: "NL", image: "/images/Platform Logos/praxis.png" },
  { name: "Brico Bravo",      country: "BE", image: "/images/Platform Logos/brico bravo.png" },
  { name: "Eprice",           country: "IT", image: "/images/Platform Logos/eprice.png" },
  { name: "IBS",              country: "IT", image: "/images/Platform Logos/ibs.png" },
  { name: "Fruugo",           country: "UK", image: "/images/Platform Logos/fruuggo.png" },
  { name: "OBI",              country: "DE", image: "/images/Platform Logos/obi.png" },
  { name: "AUCHAN",           country: "FR", image: "/images/Platform Logos/auchan.png" },
  { name: "Boulanger",        country: "FR", image: "/images/Platform Logos/boulanger.png" },
  { name: "bricomarche",      country: "FR", image: "/images/Platform Logos/brico marche.png" },
  { name: "Castorama",        country: "FR", image: "/images/Platform Logos/castorama.png" },
  { name: "Truffaut",         country: "FR", image: "/images/Platform Logos/truffaut.png" },
  { name: "ELeclerc",         country: "FR", image: "/images/Platform Logos/elerc.png" },
  { name: "laposte",          country: "FR", image: "/images/Platform Logos/laposte.png" },
  { name: "Darty",            country: "FR", image: "/images/Platform Logos/darty.png" },
  { name: "Cdiscount",        country: "FR", image: "/images/Platform Logos/cdiscount.png" },
  { name: "RAKUTEN",          country: "JP", image: "/images/Platform Logos/rakuten.png" },
  { name: "Rue de Commerce",  country: "FR", image: "/images/Platform Logos/rueducommerce.png" },
  { name: "ShowroomPrive",    country: "FR", image: "/images/Platform Logos/showroom.png" },
  { name: "ubaldi",           country: "FR", image: "/images/Platform Logos/ubaldi.png" },
  { name: "Zooplus",          country: "DE", image: "/images/Platform Logos/zooplus.png" },
  { name: "GammVert",         country: "FR", image: "/images/Platform Logos/gammvert.png" },
  { name: "Jardiland",        country: "FR", image: "/images/Platform Logos/jardiland.png" },
  { name: "MyDeal",           country: "AU", image: "/images/Platform Logos/mydeal.png" },
  { name: "KOGAN",            country: "AU", image: "/images/Platform Logos/kogan.png" },
  { name: "LASOO",            country: "AU", image: "/images/Platform Logos/laso.png" },
  { name: "emag",             country: "BG", image: "/images/Platform Logos/emag.png" },
  { name: "Pepita",           country: "HU", image: "/images/Platform Logos/pepita.png" },
  { name: "Homecentre",       country: "AE", image: "/images/Platform Logos/homecentre.png" },
  { name: "Sharaf",           country: "AE", image: "/images/Platform Logos/sharaf.png" },
  { name: "BestBuy",          country: "US", image: "/images/Platform Logos/bestbuy.png" },
  { name: "Walmart",          country: "US", image: "/images/Platform Logos/walmart.png" },
  { name: "B&Q",              country: "UK", image: "/images/Platform Logos/b&q.png" },
  { name: "Robert Dyas",      country: "UK", image: "/images/Platform Logos/robertdyas.png" },
  { name: "ONBUY",            country: "UK", image: "/images/Platform Logos/onbuy.png" },
  { name: "Trendyol",         country: "TR", image: "/images/Platform Logos/trendyol.png" },
  { name: "Noon",             country: "AE", image: "/images/Platform Logos/noon.png" },
  { name: "Bol.com",          country: "NL", image: "/images/Platform Logos/bol.png" },
  { name: "Leenbakker",       country: "NL", image: "/images/Platform Logos/leen.png" },
  { name: "Beslist",          country: "NL", image: "/images/Platform Logos/beslist.png" },
  { name: "Home24",           country: "DE", image: "/images/Platform Logos/home24.png" },
  { name: "Voelkner",         country: "DE", image: "/images/Platform Logos/voelkner.png" },
  { name: "Wayfair",          country: "US", image: "/images/Platform Logos/wayfair.png" },
  { name: "XXXLutz",          country: "DE", image: "/images/Platform Logos/lutz.png" },
  { name: "Fressnapf",        country: "DE", image: "/images/Platform Logos/fressnapf.png" },
  { name: "Poco",             country: "DE", image: "/images/Platform Logos/poco.png" },
  { name: "Vente Unique",     country: "FR", image: "/images/Platform Logos/mimov.png" },
  { name: "GALAXUS",          country: "CH", image: "/images/Platform Logos/galaxus.png" },
  { name: "manor",            country: "CH", image: "/images/Platform Logos/manor.png" },
  { name: "RICARDO",          country: "CH", image: "/images/Platform Logos/ricardo.png" },
  { name: "ALLEGRO",          country: "CZ", image: "/images/Platform Logos/allegro.png" },
  { name: "BRW",              country: "IE", image: "/images/Platform Logos/brw.png" },
  { name: "Home & You",       country: "CZ", image: "/images/Platform Logos/home&you.png" },
  { name: "Empik",            country: "CZ", image: "/images/Platform Logos/empik.png" },
  { name: "Morele",           country: "CZ", image: "/images/Platform Logos/morele.png" },
  { name: "MALL",             country: "CZ", image: "/images/Platform Logos/mall.png" },
  { name: "BigBang",          country: "SI", image: "/images/Platform Logos/bigbang.png" },
  { name: "Mimovrste",        country: "SI", image: "/images/Platform Logos/mimov.png" },
  { name: "Mall",             country: "SK", image: "/images/Platform Logos/mall.png" },
  { name: "KAUP24",           country: "HR", image: "/images/Platform Logos/kaup.png" },
  { name: "PIGU",             country: "UA", image: "/images/Platform Logos/pigu.png" },
  { name: "220",              country: "UA", image: "/images/Platform Logos/220.png" },
  { name: "Amazon",           country: "US", image: "/images/Platform Logos/amazon.png" },
  { name: "Webshop",          country: "NL", image: "/images/Platform Logos/webshop.png" },
];

const ALL_PLATFORMS = platforms.map(p => p.name).slice().sort((a, b) => a.localeCompare(b));

const PLATFORM_LOGO_MAP: Record<string, string> = Object.fromEntries(
  platforms.map(p => [p.name, p.image])
);

const platformDescriptions: Record<string, string> = {
  "ALL": "We have partnered with and managed listings across 115+ leading e-commerce platforms worldwide — from global giants to regional powerhouses spanning 24 countries. Our team delivers seamless catalog operations, product listings, and marketplace integrations at scale.",
  "Carrefour": "One of the world's largest retail chains, Carrefour operates in 30+ countries. We manage product listings and catalog operations across their Spanish marketplace, driving visibility for thousands of SKUs in one of Europe's most competitive retail environments.",
  "Conforama": "A leading European home furnishings and appliances retailer with strong presence in France and beyond. We handle end-to-end product catalog management, ensuring accurate listings and optimized content across their digital storefront.",
  "Brico Depot": "Spain's go-to destination for DIY, home improvement, and construction materials. We support their marketplace with structured product data, listing optimization, and category-level catalog management.",
  "Pccomp": "A Slovak online retailer specializing in computer hardware, peripherals, and accessories. We manage their product catalog with technical precision — ensuring accurate specs, compatibility data, and up-to-date listings across a fast-moving tech inventory.",
  "Planeta Huerto": "Spain's leading online store for organic food, natural cosmetics, and eco-friendly products. We manage their catalog with a focus on ingredient accuracy, sustainability certifications, and health-conscious product presentation.",
  "Sprinter": "One of Spain's top sports and outdoor retailers. We manage Sprinter's product listings across footwear, apparel, and sporting goods — maintaining catalog accuracy and brand-compliant content at scale.",
  "Tiendanimal": "Spain's largest pet supply marketplace. We handle product listings for food, accessories, and healthcare items — ensuring accurate pet-specific attributes, brand guidelines, and optimized content for pet owners.",
  "KIABI": "A French family fashion brand beloved for accessible, trend-forward clothing. We manage KIABI's product listings with a focus on detailed sizing, imagery, and description quality to enhance the customer shopping experience.",
  "MANOMANO": "Europe's leading DIY and home improvement marketplace with millions of products. We manage catalog operations on ManoMano's French platform, handling complex product attributes, compatibility data, and structured listing workflows.",
  "MIRAVIA": "A fast-growing Spanish lifestyle marketplace backed by Alibaba Group. We support Miravia with product onboarding, content localization, and catalog management tailored to their curated multi-brand shopping experience.",
  "Leroy Merlin": "Europe's #1 home improvement retailer, operating across 13 countries. Our team manages complex, spec-heavy catalog data for Leroy Merlin's French platform — from tools and flooring to garden and décor.",
  "CDON": "Scandinavia's largest online marketplace, serving millions of shoppers in Denmark, Sweden, Norway, and Finland. We manage product listings on CDON with Nordic market expertise and localized content strategies.",
  "FYNDIQ": "A popular Danish discount marketplace known for great deals and a wide product range. We handle catalog setup, listing optimization, and product data management to maximize visibility on this value-focused platform.",
  "Altex": "Bulgaria's top consumer electronics and appliances retailer. We manage Altex product listings with technically accurate specs, localized Bulgarian content, and consistent catalog quality across their digital storefront.",
  "CEL": "A leading Bulgarian electronics marketplace trusted by local consumers. We support CEL with structured product data, accurate technical attributes, and catalog management aligned with their platform standards.",
  "Okazii": "Bulgaria's most popular online classifieds and marketplace platform. We manage product listings on Okazii with localized content, competitive positioning, and catalog compliance for the Bulgarian market.",
  "Public": "Greece's go-to destination for tech, electronics, and entertainment products. We manage Public's product catalog with accurate specs, Greek-language content, and structured data to meet their high listing standards.",
  "Vivre": "A premium Bulgarian online marketplace focused on home décor, furniture, and lifestyle products. We manage Vivre listings with attention to design details, product storytelling, and category-specific catalog requirements.",
  "Worten": "A leading Portuguese and Spanish consumer electronics retailer. We handle Worten's catalog operations with technically precise product data, brand-compliant listings, and optimized content for Iberian shoppers.",
  "ClubeFashion": "A Spanish fashion and lifestyle marketplace offering curated brands and seasonal collections. We manage product listings with accurate sizing, styling attributes, and brand-consistent content across their digital storefront.",
  "Sport Zone": "A major Iberian sporting goods retailer with strong presence in Spain and Portugal. We support Sport Zone with structured product catalog management, attribute accuracy, and optimized listings across their sports categories.",
  "KuantoKusta": "Spain's leading price comparison and shopping platform. We manage product data feeds and catalog submissions to maximize visibility and accuracy across KuantoKusta's aggregator-driven marketplace.",
  "Decathlon": "The world's largest sporting goods retailer, present in 60+ countries. We partner with Decathlon to maintain accurate, high-quality product listings across their French marketplace, covering thousands of sports categories.",
  "Brico": "Belgium's trusted DIY and home improvement retailer. We handle Brico's product catalog with structured data for tools, materials, and garden products — ensuring listing accuracy and compliance with their platform guidelines.",
  "Inno": "A Belgian department store and online retailer offering fashion, home, and lifestyle products. We manage product listings with attention to brand presentation, accurate attributes, and consistent catalog quality.",
  "FNAC": "A leading French-Belgian cultural and electronics retailer. We manage FNAC's product listings across books, tech, and entertainment — ensuring spec-accurate data, clear product descriptions, and compliance with their strict content standards.",
  "Hubo": "Belgium's largest DIY retail chain. We support Hubo with structured catalog management for hardware, tools, and construction materials — maintaining listing accuracy and data consistency across their digital platform.",
  "KAUFLAND": "A major German hypermarket chain expanding aggressively in e-commerce. We manage Kaufland marketplace listings with precise product data, German-language content, and compliance with their multi-category platform standards.",
  "OTTO": "Germany's second-largest online retailer with a broad product range. We manage OTTO marketplace listings with structured catalog data, brand-compliant content, and German-language optimization for this highly competitive platform.",
  "Check 24": "Germany's leading price comparison and online marketplace platform. We handle product data submissions and catalog management for Check24, maximizing product visibility across their high-traffic comparison engine.",
  "Newegg": "A US-based tech marketplace specializing in electronics, computer hardware, and gaming gear. We manage Newegg product listings with technical precision — accurate specs, compatibility data, and structured catalog management.",
  "eBay": "A global marketplace connecting millions of buyers and sellers. We manage eBay product listings for clients across multiple categories, ensuring accurate item specifics, competitive positioning, and optimized content.",
  "Houzz": "The world's leading home renovation and design platform. We manage Houzz product listings for home décor and furnishing brands — focusing on design-forward imagery, detailed specs, and room-based merchandising content.",
  "Kroger": "America's largest supermarket chain and a growing digital commerce platform. We manage Kroger marketplace listings with accurate product data, compliance with grocery listing standards, and optimized content for online shoppers.",
  "Macys": "An iconic American department store with a powerful digital marketplace. We manage Macy's product listings across fashion, home, and beauty — maintaining brand standards, detailed attributes, and high-quality catalog content.",
  "SEARS": "A long-standing US retail marketplace with broad product categories. We support Sears marketplace sellers with catalog setup, listing optimization, and product data management to maintain visibility and compliance.",
  "Overstock": "A US-based online retailer known for home furnishings and discounted goods. We manage Overstock product listings with detailed furniture specs, lifestyle imagery descriptions, and catalog compliance to maximize sales potential.",
  "RetailCloud": "A US-based retail technology and marketplace platform. We handle catalog integration, product data management, and listing optimization to support sellers operating on RetailCloud's commerce infrastructure.",
  "Temu": "One of the fastest-growing global e-commerce platforms with massive reach across US and international markets. We manage Temu product listings with competitive pricing data, accurate attributes, and high-volume catalog operations.",
  "WALMART": "America's largest retailer and a growing e-commerce force. We support Walmart marketplace sellers with catalog setup, listing quality audits, and content optimization to maximize product discoverability.",
  "Shein": "A global fast-fashion powerhouse with unmatched scale and speed. We manage product listings on Shein with trend-accurate descriptions, size-specific attributes, and catalog management tailored to their high-velocity fashion model.",
  "WISH": "A mobile-first global discount marketplace popular in the US and Europe. We manage Wish product listings with value-focused content, accurate attributes, and catalog management designed for their price-driven consumer base.",
  "BUNNINGS": "Australia and New Zealand's leading home improvement and hardware retailer. We support Bunnings with structured catalog data, product spec management, and listing compliance across their expansive digital product range.",
  "Catch of the Day": "Australia's popular marketplace offering deals across electronics, fashion, and homewares. We manage Catch listings with accurate product data, promotional content, and catalog compliance for the Australian online shopper.",
  "Barbequesgalore": "Australia's specialty retailer for BBQ grills, outdoor cooking, and accessories. We manage detailed product listings including grill specs, fuel types, and accessory compatibility — supporting Australia's passionate BBQ culture.",
  "Harvey Norman": "Australia's leading electrical, computer, furniture, and bedding retailer. We support Harvey Norman's Australian marketplace with optimized product listings, accurate specifications, and quality catalog management.",
  "OZSALE": "Australia's leading members-only online shopping club offering exclusive brand deals. We manage product listings on OzSale with event-based catalog management and time-sensitive promotional content.",
  "Conrad": "A leading European electronics and technology retailer operating in Germany and across Europe. We manage Conrad's product catalog with high-precision technical data, accurate specs, and structured listings for complex electronics categories.",
  "Metro": "A leading German wholesale and B2B retail platform. We manage Metro product listings with business-oriented content, bulk-purchase attributes, and accurate product data tailored to their professional buyer audience.",
  "MediaMarkt": "Europe's leading consumer electronics retailer. We support MediaMarkt's German marketplace with highly technical product data, spec-accurate listings, and structured catalog management for complex electronics categories.",
  "HOOD": "A German online marketplace with a wide range of products. We manage Hood.de listings with accurate product data, German-language content, and catalog compliance to support sellers across this established marketplace.",
  "YATEGO": "A German online shopping portal aggregating products from thousands of sellers. We manage product submissions and catalog data for Yatego, ensuring listing accuracy and visibility across their comparison-driven platform.",
  "PRAXIS": "The Netherlands' leading home improvement and DIY retailer. We manage Praxis product listings with structured catalog data for tools, materials, and garden products — optimized for Dutch consumers.",
  "Brico Bravo": "A Belgian DIY and home improvement marketplace. We handle catalog management for Brico Bravo with structured product data, accurate attributes, and listing compliance for their home improvement shoppers.",
  "Eprice": "Italy's established consumer electronics online retailer. We manage Eprice product listings with technical accuracy, Italian-language optimization, and structured catalog data for competitive electronics categories.",
  "IBS": "An Italian online marketplace specializing in books, music, games, and digital media. We manage IBS product listings with precise metadata, ISBN data, and content quality standards for their culturally rich catalog.",
  "Fruugo": "A global cross-border marketplace operating in 42+ countries including the UK. We manage Fruugo listings with multi-language content, currency-adjusted pricing data, and catalog compliance for international shoppers.",
  "OBI": "A leading European DIY and home improvement retailer with a strong German presence. We manage OBI product listings with detailed construction and gardening specs — ensuring catalog accuracy across their extensive product range.",
  "AUCHAN": "A major French hypermarket and e-commerce retailer operating across Europe. We manage Auchan product listings with structured catalog data, French-language content, and compliance with their multi-category platform standards.",
  "Boulanger": "A leading French electronics and home appliance retailer. We support Boulanger with spec-accurate product listings, structured technical data, and catalog management for a wide range of consumer electronics.",
  "bricomarche": "A major French DIY and garden retailer. We handle Bricomarché product catalog operations with structured data for hardware, outdoor, and construction categories — tailored for French home improvement shoppers.",
  "Castorama": "France's popular DIY and home improvement chain. We manage Castorama product listings with detailed attribute data, brand-compliant content, and structured catalog management across their renovation and home décor categories.",
  "Truffaut": "France's leading garden and outdoor living retailer. We manage Truffaut product listings with specialized garden, plant, and outdoor living data — ensuring accurate botanical and product specs for French gardening enthusiasts.",
  "ELeclerc": "One of France's largest supermarket and hypermarket chains. We manage E.Leclerc marketplace listings with accurate product data, competitive content, and catalog compliance across their broad consumer goods categories.",
  "laposte": "France's national postal service with an expanding e-commerce marketplace. We handle La Poste platform listings with structured catalog data, accurate product information, and optimized content for French online shoppers.",
  "Darty": "A leading French consumer electronics and appliances retailer. We manage Darty product listings with technical precision, French-language content, and structured catalog data for home electronics and white goods.",
  "Cdiscount": "France's second-largest e-commerce platform, known for competitive pricing and wide product range. We manage Cdiscount product listings with structured data, promotional content, and catalog optimization for French consumers.",
  "RAKUTEN": "Japan's largest e-commerce marketplace and one of the world's most visited retail platforms. We manage Rakuten product listings with Japanese market expertise, accurate catalog data, and culturally relevant product content.",
  "Rue de Commerce": "A French online marketplace offering electronics, home goods, and accessories. We manage Rue du Commerce listings with accurate product attributes, French-language content, and catalog compliance for their digital storefront.",
  "ShowroomPrive": "A leading French members-only fashion and lifestyle marketplace. We manage ShowroomPrivé product listings with brand-focused content, exclusive event-based catalog management, and fashion-specific attribute accuracy.",
  "ubaldi": "A French online retailer specializing in household appliances and electronics. We manage Ubaldi product listings with precise technical specs, installation data, and structured catalog management for appliance categories.",
  "Zooplus": "Europe's largest online pet supply retailer, operating in 30 countries including Germany. We manage Zooplus product listings with pet-specific attributes, brand compliance, and catalog data for food, accessories, and healthcare products.",
  "GammVert": "France's leading garden and outdoor products retailer. We manage GammVert product listings with detailed botanical data, seasonal catalog updates, and accurate garden product specs for French consumers.",
  "Jardiland": "A popular French garden center and outdoor living chain. We manage Jardiland product listings with plant care data, outdoor furniture specs, and seasonal catalog management for their garden-focused audience.",
  "MyDeal": "An Australian lifestyle and home products marketplace. We manage MyDeal listings with structured product data, competitive content, and catalog management across furniture, home essentials, and lifestyle categories.",
  "KOGAN": "Australia's leading pure-play online retailer. We manage Kogan product listings with accurate specs, competitive pricing content, and catalog operations across a wide range of electronics, appliances, and lifestyle products.",
  "LASOO": "Australia's largest online catalogue and deals aggregator. We manage product data submissions and catalog management for Lasoo, ensuring accurate product information and visibility across their comparison-driven platform.",
  "emag": "Bulgaria's largest e-commerce platform, offering a wide range of electronics, appliances, and household goods. We manage eMAG listings with Bulgarian-language content, accurate technical data, and structured catalog management.",
  "Pepita": "Hungary's established online marketplace with a broad consumer product range. We handle Pepita product listings with Hungarian-language content, structured catalog data, and compliance with their platform requirements.",
  "Homecentre": "A leading Middle Eastern home furnishings and lifestyle retailer. We manage Home Centre listings with region-specific product content, Arabic and English attributes, and catalog compliance for the UAE market.",
  "Sharaf": "A major UAE consumer electronics and home appliances retailer. We manage Sharaf DG product listings with technical precision, Arabic-English bilingual content, and catalog management for the Middle Eastern consumer.",
  "BestBuy": "America's largest consumer electronics retailer. We support BestBuy marketplace listings with spec-accurate product data, keyword-optimized descriptions, and structured catalog management across tech, appliances, and entertainment.",
  "Walmart": "America's largest retailer and a growing e-commerce force. We support Walmart marketplace sellers with catalog setup, listing quality audits, and content optimization to maximize product discoverability.",
  "B&Q": "The UK's largest home improvement and garden retailer. We manage B&Q product listings with structured DIY and garden product data, accurate technical specs, and catalog compliance for British home improvers.",
  "Robert Dyas": "A UK household goods and DIY retailer with a strong online presence. We manage Robert Dyas product listings with accurate product descriptions, organized category data, and catalog management for their British shoppers.",
  "ONBUY": "A fast-growing UK marketplace offering competitive pricing across a wide product range. We manage OnBuy product listings with structured catalog data, competitive content, and listing compliance for UK consumers.",
  "Trendyol": "Turkey's largest e-commerce platform with rapid regional expansion. We manage product catalogs on Trendyol with localized content strategies tailored to Turkish consumer preferences and marketplace requirements.",
  "Noon": "The Middle East's homegrown e-commerce giant, serving the UAE, Saudi Arabia, and Egypt. We manage Noon marketplace listings with Arabic and English content, driving visibility across one of the fastest-growing digital retail markets.",
  "Bol.com": "The Netherlands' #1 online retailer, trusted by millions of Dutch and Belgian shoppers. We manage product listings on Bol.com with a focus on localized content, Dutch-language optimization, and catalog compliance.",
  "Leenbakker": "A popular Dutch online furniture and home décor retailer. We manage Leenbakker product listings with interior design-focused content, accurate dimensions, and structured catalog data for Dutch home shoppers.",
  "Beslist": "The Netherlands' leading product comparison and shopping platform. We manage product data feeds and catalog submissions for Beslist, ensuring accurate listings and maximum visibility across their aggregator marketplace.",
  "Home24": "A leading European online furniture and home décor marketplace operating in Germany. We manage Home24 product listings with detailed furniture specs, style attributes, and localized content for German and European consumers.",
  "Voelkner": "A German online electronics and technology retailer. We handle Voelkner product listings with technical accuracy, structured spec data, and catalog management for their electronics-focused customer base.",
  "Wayfair": "The world's largest online home furnishings and décor retailer. We manage Wayfair product listings with detailed interior specs, lifestyle-focused content, and catalog compliance for their enormous global customer base.",
  "XXXLutz": "One of Europe's largest furniture and home furnishings retailers, based in Germany. We manage XXXLutz product listings with precise dimension data, material specs, and catalog management for their wide furniture range.",
  "Fressnapf": "Europe's largest pet supply chain, headquartered in Germany. We manage Fressnapf product listings with pet-specific attributes, brand-compliant content, and structured catalog data across food, health, and accessory categories.",
  "Poco": "A German discount furniture and home goods retailer. We manage Poco product listings with accurate dimension data, material attributes, and structured catalog management for their value-focused home furnishing range.",
  "Vente Unique": "A French online furniture and home décor marketplace. We manage Vente-unique product listings with interior design specs, lifestyle descriptions, and catalog compliance for French home shoppers.",
  "GALAXUS": "Switzerland's largest online retailer, offering a vast range of electronics, home, and lifestyle products. We manage Galaxus product listings with multilingual content, Swiss-market accuracy, and structured catalog data.",
  "manor": "Switzerland's leading department store chain with a strong online presence. We manage Manor product listings across fashion, home, and beauty categories — with Swiss-specific content and catalog management.",
  "RICARDO": "Switzerland's top online marketplace for new and used goods. We manage Ricardo product listings with accurate descriptions, condition data, and catalog management tailored to the Swiss consumer marketplace.",
  "ALLEGRO": "Central Europe's largest e-commerce platform, dominant in Poland and expanding across the Czech Republic. We manage Allegro product listings with localized content, Polish-language optimization, and structured catalog compliance.",
  "BRW": "An Irish furniture and home accessories retailer. We manage BRW product listings with furniture-specific attributes, accurate dimensions, and catalog management for the Irish online home goods market.",
  "Home & You": "A lifestyle and home accessories brand operating in the Czech Republic and broader Central Europe. We manage their product listings with creative home décor content, accurate attributes, and catalog compliance.",
  "Empik": "Poland's leading cultural and lifestyle marketplace, offering books, music, electronics, and more. We manage Empik product listings with rich product metadata, Polish-language descriptions, and structured catalog data.",
  "Morele": "A major Polish online electronics and tech retailer. We manage Morele product listings with technical precision, Polish-language content, and structured catalog management for competitive electronics categories.",
  "MALL": "A leading Czech and Slovak online marketplace. We manage Mall.cz product listings with localized content for Czech and Slovak consumers, structured catalog data, and compliance with their multi-category platform standards.",
  "BigBang": "Slovenia's leading consumer electronics and home appliances retailer. We manage BigBang product listings with technical accuracy, Slovenian-language content, and structured catalog management for local consumers.",
  "Mimovrste": "Slovenia's most visited online store for electronics, home goods, and outdoor products. We manage Mimovrste product listings with precise Slovenian-language content, accurate specs, and structured catalog data.",
  "Mall": "A leading Slovak and Czech online marketplace. We manage Mall.sk product listings with structured catalog data, localized Slovak-language content, and compliance with their multi-category platform standards.",
  "KAUP24": "A Croatian online marketplace for home, garden, and DIY products. We manage Kaup24 product listings with Croatian-language content, structured attribute data, and catalog compliance for the local market.",
  "PIGU": "Ukraine's established online marketplace with a broad consumer product range. We manage Pigu listings with Ukrainian-language content, structured catalog data, and compliance tailored to Eastern European market needs.",
  "220": "A Ukrainian consumer electronics and appliances retailer. We manage 220.ua product listings with technical precision, Ukrainian-language descriptions, and structured catalog management for their electronics-focused audience.",
  "Amazon": "The world's largest e-commerce platform. We manage Amazon marketplace listings with best-practice content, keyword-optimized descriptions, and compliance with Amazon's strict catalog guidelines across multiple categories.",
  "Webshop": "A Dutch e-commerce platform for online retail. We manage product listings with structured data, localized Dutch content, and catalog compliance tailored to the Netherlands' competitive online retail market.",
};

const industryData: Record<string, { eyebrow: string; title: string; body: string; backdrop: string; count: number; label: string }> = {
  kitchen:     { eyebrow: '🍳 Kitchen Industry',       title: 'Cookware & Kitchen Brands',    body: 'Our kitchen vertical brings together brands that have built strong reputations in home cooking, kitchen hardware, and BBQ culture. From premium faucet systems and modern appliances to outdoor grilling setups, we help these brands reach buyers across leading e-commerce platforms at scale.', backdrop: 'KI', count: 3,  label: 'KITCHEN' },
  electronics: { eyebrow: 'Electronics & Accessories', title: 'Tech & Consumer Electronics',   body: 'We manage a growing roster of consumer electronics brands spanning smart home lighting, security cameras, high-performance powerbanks, and vaping devices. Each brand requires precise catalog management and marketplace integrations across multiple platforms and regions.', backdrop: 'EL', count: 4,  label: 'ELECTRONICS' },
  fashion:     { eyebrow: 'Fashion Retail',             title: 'Apparel & Style Brands',        body: 'Our fashion portfolio covers the full spectrum — from elegant bridal gowns to high-performance athleisure. These brands operate in competitive, trend-driven marketplaces where product presentation, sizing accuracy, and fast catalog updates are mission-critical for conversion.', backdrop: 'FA', count: 2,  label: 'FASHION RETAIL' },
  home:        { eyebrow: 'Home & Ergonomics',          title: 'Workspace & Home Solutions',    body: 'We support brands building the future of home and office comfort. Ergonomic standing desks, adjustable chairs, and wellness accessories require meticulous product listing accuracy and cross-platform coordination to serve both B2B and B2C buyers effectively.', backdrop: 'HO', count: 2,  label: 'HOME & ERGO' },
  medical:     { eyebrow: 'Medical & Healthcare',       title: 'Healthcare & Medical Devices',  body: 'Healthcare is one of our most compliance-sensitive verticals. We manage listings for brands producing patient monitoring systems, consumer health devices, and oral care products — ensuring catalog accuracy, regulatory alignment, and seamless marketplace operations.', backdrop: 'ME', count: 2,  label: 'MEDICAL' },
  automotive:  { eyebrow: 'Automotive',                 title: 'Auto Parts & Accessories',      body: 'The automotive vertical demands deep product knowledge and precise fitment data. We manage accounts for OEM replacement parts suppliers and child vehicle safety brands, ensuring accurate compatibility listings and high discoverability on major e-commerce platforms.', backdrop: 'AU', count: 2,  label: 'AUTOMOTIVE' },
  travel:      { eyebrow: 'Travel & Government',        title: "Travel & Gov't Services",       body: "This vertical bridges public services and digital travel commerce. We support visa processing platforms and online flight booking services — managing their digital presence, account operations, and platform integrations to streamline global traveler experiences.", backdrop: 'TR', count: 2,  label: "TRAVEL & GOV'T" },
  logistics:   { eyebrow: 'Logistics',                  title: 'Tracking & Delivery',           body: 'Logistics technology is the backbone of modern e-commerce. We partner with platforms that offer real-time shipment tracking and end-to-end delivery management — helping them maintain accurate product listings and operational visibility across multiple channels.', backdrop: 'LO', count: 1,  label: 'LOGISTICS' },
  software:    { eyebrow: 'Software',                   title: 'Digital Software Products',     body: 'Consumer and professional software brands face unique listing challenges — from license types to version management. We handle catalog operations for software publishers, ensuring clear product differentiation, accurate descriptions, and compliant marketplace presence.', backdrop: 'SW', count: 1,  label: 'SOFTWARE' },
  specialty:   { eyebrow: 'Specialty Verticals',        title: 'Niche & Specialty Brands',      body: 'Our specialty portfolio spans a rich diversity of niches — from thermal label printers and portable coolers to micromobility scooters, eyewear accessories, studio audio equipment, and curated hospitality booking. Each brand gets a tailored marketplace strategy built for its unique audience.', backdrop: 'SP', count: 6,  label: 'SPECIALTY' },
};

/* ─────────────────────────────────────────────
   MOSAIC HOOK (platforms hero)
───────────────────────────────────────────── */
function usePlatformsMosaic(stageRef: React.RefObject<HTMLDivElement>, wrapRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const stage = stageRef.current;
    const wrap  = wrapRef.current;
    if (!stage || !wrap) return;

    const isMobile = window.innerWidth < 640;
    const CARD_W = isMobile ? 175 : 200;
    const CARD_H = isMobile ? 150 : 200;
    const STEP   = CARD_W + (isMobile ? 14 : 16);
    const COUNT  = ALL_PLATFORMS.length;
    const AUTO_SPEED = 0.010;
    const VISIBLE = isMobile ? 2 : 7;

    stage.style.height = CARD_H + "px";

    let offset = 0, vel = 0, dragging = false;
    let dragStartX = 0, dragStartOff = 0, lastX = 0;
    let autoActive = true;
    let rafId: number;

    function getCardStyle(dist: number) {
      const absDist = Math.abs(dist);
      const scale   = Math.max(0.60, 1 - absDist * 0.06);
      const tx      = dist * STEP;
      const ty      = absDist * absDist * 5;
      const zIndex  = Math.round(100 - absDist * 10);
      const opacity = Math.max(0.20, 1 - absDist * 0.14);
      return { scale, tx, ty, zIndex, opacity };
    }

    const pool: { div: HTMLDivElement; img: HTMLImageElement; span: HTMLSpanElement }[] = [];
    for (let i = 0; i < (VISIBLE * 2 + 1); i++) {
      const div = document.createElement("div");
      div.className = "mosaic-card";
      div.style.width  = CARD_W + "px";
      div.style.height = CARD_H + "px";
      const img = document.createElement("img") as HTMLImageElement;
      img.draggable = false;
      img.loading   = "eager";
      const lbl = document.createElement("div");
      lbl.className = "mosaic-card-label";
      const span = document.createElement("span");
      lbl.appendChild(span);
      div.appendChild(img); div.appendChild(lbl);
      stage.appendChild(div);
      pool.push({ div, img, span });
    }

    function render() {
      const centerIdx = Math.round(offset);
      pool.forEach((el, poolIdx) => {
        const d = poolIdx - VISIBLE;
        const idx = ((centerIdx + d) % COUNT + COUNT) % COUNT;
        const frac = offset - centerIdx;
        const dist = d - frac;
        const absDist = Math.abs(dist);
        if (absDist > VISIBLE + 0.5) { el.div.style.display = "none"; return; }
        el.div.style.display = "";
        const { scale, tx, ty, zIndex, opacity } = getCardStyle(dist);
        el.div.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(${scale})`;
        el.div.style.zIndex    = String(zIndex);
        el.div.style.opacity   = String(opacity);
        const platformName = ALL_PLATFORMS[idx];
        const newSrc = PLATFORM_LOGO_MAP[platformName] ?? PLATFORM_LOGO_MAP["_fallback"];
        if (el.img.src !== newSrc) {
          el.img.src = newSrc;
          el.img.style.objectFit = "contain";
          el.img.style.padding = "6px";
          el.img.style.background = "#fff";
          el.img.style.width = "100%";
          el.img.style.height = "72%";
        }
        el.img.alt       = ALL_PLATFORMS[idx];
        el.span.textContent = ALL_PLATFORMS[idx];
      });
    }

    let lastTime = 0;
    function animate(ts: number) {
      const dt = lastTime === 0 ? 16 : Math.min(ts - lastTime, 32);
      lastTime = ts;
      if (!dragging) {
        if (autoActive) {
          offset += AUTO_SPEED * (dt / 16);
        } else {
          vel *= 0.94;
          offset += vel;
          if (Math.abs(vel) < 0.001) autoActive = true;
        }
        offset = ((offset % COUNT) + COUNT) % COUNT;
      }
      render();
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    const onDown = (e: PointerEvent) => {
      dragging = true; autoActive = false; vel = 0;
      dragStartX = e.clientX; dragStartOff = offset; lastX = e.clientX;
      wrap.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      vel = (lastX - e.clientX) / STEP;
      lastX = e.clientX;
      offset = ((dragStartOff + dx / STEP * -1) % COUNT + COUNT) % COUNT;
    };
    const onUp = () => { dragging = false; };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup",    onUp);
    wrap.addEventListener("pointerleave", onUp);

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup",    onUp);
      wrap.removeEventListener("pointerleave", onUp);
      stage.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ─────────────────────────────────────────────
   SVG MOSAIC HOOK (tools / industries hero)
───────────────────────────────────────────── */
interface MosaicItem { name: string; bg: string; fg: string; src: string; }

function useSVGMosaic(containerId: string, items: MosaicItem[], variant: "logo" | "photo" = "logo") {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container || items.length < 5) return;

    const positions = [
      { left: '4%',  top: '0%',   width: '52%', height: '55%' },
      { left: '58%', top: '0%',   width: '40%', height: '44%' },
      { left: '4%',  top: '57%',  width: '38%', height: '44%' },
      { left: '44%', top: '50%',  width: '24%', height: '32%' },
      { left: '70%', top: '57%',  width: '28%', height: '40%' },
    ];
    const TRANSITION_MS = 600;
    const CYCLE_MS = 2400;

    container.innerHTML = '';
    container.style.position = 'relative';

    const slotItemIdx = [0, 1, 2, 3, 4];
    let nextItemIdx = 5 % items.length;

    function setCardContent(card: HTMLDivElement, item: MosaicItem) {
      card.style.background = '#fff';
      const img = card.querySelector('img') as HTMLImageElement;
      const lbl = card.querySelector('[data-label]') as HTMLDivElement;
      if (img) { img.src = item.src; img.alt = item.name; }
      if (lbl) lbl.textContent = item.name;
    }

    function createCard(item: MosaicItem, posIdx: number): HTMLDivElement {
      const pos = positions[posIdx];
      const el = document.createElement('div') as HTMLDivElement;
      Object.assign(el.style, {
        position: 'absolute', left: pos.left, top: pos.top,
        width: pos.width, height: pos.height,
        borderRadius: '18px', overflow: 'hidden', background: '#fff',
        transition: `left ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), top ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), width ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), height ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
        zIndex: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '5px 5px 16px rgba(0,0,0,0.10), 2px 2px 5px rgba(0,0,0,0.06)',
      });
      const img = document.createElement('img');
      img.src = item.src; img.alt = item.name;
      if (variant === "photo") {
        Object.assign(img.style, {
          position: 'absolute', top: '0', left: '0',
          width: '100%', height: '72%', objectFit: 'cover',
          display: 'block', pointerEvents: 'none',
        });
      } else {
        Object.assign(img.style, {
          width: '85%', height: '85%', objectFit: 'contain',
          display: 'block', pointerEvents: 'none',
        });
      }
      el.appendChild(img);
      const label = document.createElement('div');
      label.setAttribute('data-label', '1');
      Object.assign(label.style, {
        position: 'absolute', bottom: '0', left: '0', right: '0',
        height: '28%', display: 'flex', alignItems: 'center',
        padding: '0 12px',
        background: '#fff',
        borderTop: '1px solid #ebebeb',
        color: '#1a1a1a', fontSize: '14px', fontWeight: '700',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      });
      label.textContent = item.name;
      el.appendChild(label);
      (el as any)._slot = posIdx;
      return el;
    }

    function applyPosition(card: HTMLDivElement, posIdx: number) {
      const pos = positions[posIdx];
      card.style.left = pos.left; card.style.top = pos.top;
      card.style.width = pos.width; card.style.height = pos.height;
      card.style.zIndex = posIdx === 0 ? '3' : '1';
      (card as any)._slot = posIdx;
    }

    const cards: HTMLDivElement[] = [];
    for (let i = 0; i < 5; i++) {
      const card = createCard(items[i], i);
      container.appendChild(card);
      cards.push(card);
    }

    let intervalId: ReturnType<typeof setInterval>;
    const rotateTick = () => {
      const cardGoingToFront = cards.find(c => (c as any)._slot === 4)!;
      const newItem = items[nextItemIdx];
      setCardContent(cardGoingToFront, newItem);
      nextItemIdx = (nextItemIdx + 1) % items.length;
      requestAnimationFrame(() => {
        cards.forEach(c => { applyPosition(c, ((c as any)._slot + 1) % 5); });
      });
    };

    setTimeout(() => { intervalId = setInterval(rotateTick, CYCLE_MS); }, 800);

    return () => { clearInterval(intervalId); container.innerHTML = ''; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);
}


/* ─────────────────────────────────────────────
   SCROLL ANIMATION HOOK
───────────────────────────────────────────── */
function useScrollAnims() {
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-anim, .scroll-anim-2, .scroll-anim-3");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));

    // Generic reveal-on-scroll: any `.rv` element gets `.in` when it enters view.
    // Staggered children via `.rv-stagger > *` animate in sequence (CSS handles delay).
    const rvEls = document.querySelectorAll(".rv, .rv-stagger");
    const rvObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); rvObs.unobserve(e.target); }
      }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    rvEls.forEach(el => rvObs.observe(el));

    return () => { obs.disconnect(); rvObs.disconnect(); };
  });
}

/* ─────────────────────────────────────────────
   PLATFORM SLIDER COMPONENT  (infinite circular)
───────────────────────────────────────────── */
function PlatformSlider({ items, selectedCountry }: { items: Platform[]; selectedCountry: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef   = useRef<HTMLDivElement>(null);
  const autoRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef     = useRef<number>(0);
  const nameRef    = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const badgeRef   = useRef<HTMLSpanElement>(null);
  const activeRef  = useRef(0); // mirrors activeIdx without closure stale issues

  const [cardSize, setCardSize] = useState(320);
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setCardSize(w < 768 ? Math.round(w * 0.70) : 320);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const STRIDE = cardSize + 20;
  const count  = items.length;

  // looped = [clone-of-last,  item0, item1, …, itemN-1,  clone-of-first]
  // looped index of real item i  →  i + 1
  // scrollLeft of looped index k →  k * STRIDE
  const looped = count > 0 ? [items[count - 1], ...items, items[0]] : [];

  // Update left-panel text imperatively (no state, no re-render)
  const updatePanel = useCallback((realIdx: number) => {
    const p = items[realIdx];
    if (!p) return;
    if (nameRef.current) {
      nameRef.current.classList.add("txt-enter");
      setTimeout(() => { if (nameRef.current) { nameRef.current.textContent = p.name; nameRef.current.classList.remove("txt-enter"); } }, 10);
    }
    if (descRef.current) {
      descRef.current.classList.add("txt-enter");
      setTimeout(() => { if (descRef.current) { descRef.current.textContent = platformDescriptions[p.name] ?? platformDescriptions["ALL"]; descRef.current.classList.remove("txt-enter"); } }, 50);
    }
    if (badgeRef.current) badgeRef.current.textContent = p.country ?? "";
  }, [items]);

  // Animate scrollLeft from current to target, then call onDone
  const animateTo = useCallback((targetScroll: number, onDone?: () => void) => {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(rafRef.current);
    const start = track.scrollLeft;
    const dist  = targetScroll - start;
    if (Math.abs(dist) < 1) { onDone?.(); return; }
    const dur = 420, t0 = performance.now();
    function ease(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    function step(now: number) {
      const pct = Math.min((now - t0) / dur, 1);
      if (track) track.scrollLeft = start + dist * ease(pct);
      if (pct < 1) { rafRef.current = requestAnimationFrame(step); }
      else { onDone?.(); }
    }
    rafRef.current = requestAnimationFrame(step);
  }, []);

  // Navigate to a real index with animation. Handles infinite wrap transparently.
  const goTo = useCallback((realIdx: number) => {
    if (count === 0) return;
    const wrapped = ((realIdx % count) + count) % count;
    const loopedTarget = wrapped + 1; // looped index of real item
    activeRef.current = wrapped;
    setActiveIdx(wrapped);
    updatePanel(wrapped);

    animateTo(loopedTarget * STRIDE, () => {
      const track = trackRef.current;
      if (!track) return;
      // We just landed on a real item — nothing to do.
      // But if we landed on the clone-of-first (loopedTarget === count+1),
      // or clone-of-last (loopedTarget === 0), teleport silently.
      // This shouldn't happen here since we always go to wrapped+1 (1..count),
      // but guard anyway.
    });
  }, [count, animateTo, updatePanel, STRIDE]);

  // Navigate to a looped index — used for the "wrap-around" transition
  // Scrolls to clone, then instantly jumps to the real equivalent
  const goToLooped = useCallback((loopedIdx: number, thenRealIdx: number) => {
    if (count === 0) return;
    activeRef.current = thenRealIdx;
    setActiveIdx(thenRealIdx);
    updatePanel(thenRealIdx);

    animateTo(loopedIdx * STRIDE, () => {
      // Animation finished on the clone → silently jump to the real counterpart
      const track = trackRef.current;
      if (track) track.scrollLeft = (thenRealIdx + 1) * STRIDE;
    });
  }, [count, animateTo, updatePanel, STRIDE]);

  // Decide which animation to use: normal vs wrap-around clone
  const navigate = useCallback((from: number, to: number) => {
    if (count === 0) return;
    const wrappedTo = ((to % count) + count) % count;

    // Going forward past last → animate to clone-of-first, then jump to real first
    if (from === count - 1 && wrappedTo === 0) {
      goToLooped(count + 1, 0);
    }
    // Going backward past first → animate to clone-of-last, then jump to real last
    else if (from === 0 && wrappedTo === count - 1) {
      goToLooped(0, count - 1);
    }
    else {
      goTo(wrappedTo);
    }
  }, [count, goTo, goToLooped]);

  const scheduleAuto = useCallback((realIdx: number) => {
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      const next = (realIdx + 1) % Math.max(count, 1);
      navigate(realIdx, next);
      scheduleAuto(next);
    }, 3500);
  }, [count, navigate]);

  // Init — reset to the first item whenever the filtered item list changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    activeRef.current = 0;
    setActiveIdx(0);
    track.scrollLeft = STRIDE; // looped[1] = items[0]
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Auto-advance timer — lives in its own effect keyed on `scheduleAuto`
  // itself, so whenever STRIDE (mobile card size) changes and produces a
  // fresh `scheduleAuto` closure, the previous (stale-width) pending timer
  // is cancelled and a correct one takes over, instead of firing once with
  // the wrong stride and misaligning the track.
  useEffect(() => {
    if (count === 0) return;
    scheduleAuto(activeRef.current);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [scheduleAuto, count]);

  // Re-sync scroll position whenever the card size (and thus STRIDE) changes —
  // e.g. right after mount when the real mobile width is detected, or on
  // orientation change. Without this the track stays aligned to the stale
  // width, leaving cards partially cut off on mobile.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    track.scrollLeft = (activeRef.current + 1) * STRIDE;
  }, [STRIDE, count]);

  // Drag
  const dragRef    = useRef<{ startX: number; startScroll: number; dragging: boolean }>({ startX: 0, startScroll: 0, dragging: false });
  const isDragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    if (autoRef.current) clearTimeout(autoRef.current);
    cancelAnimationFrame(rafRef.current);
    isDragging.current = false;
    dragRef.current = { startX: e.clientX, startScroll: track.scrollLeft, dragging: true };
    track.setPointerCapture(e.pointerId);
    track.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) isDragging.current = true;
    track.scrollLeft = dragRef.current.startScroll - dx;
  }, []);

  const onPointerUp = useCallback(() => {
    const track = trackRef.current;
    if (!track || !dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    track.style.cursor = "";
    let nearest = Math.round(track.scrollLeft / STRIDE);
    nearest = Math.max(0, Math.min(nearest, looped.length - 1));
    // Resolve looped index to real index
    let destReal: number;
    if (nearest === 0) destReal = count - 1;
    else if (nearest === count + 1) destReal = 0;
    else destReal = nearest - 1;
    navigate(activeRef.current, destReal);
    scheduleAuto(destReal);
  }, [looped.length, count, navigate, scheduleAuto, STRIDE]);

  if (count === 0) {
    return <p className="text-center py-20 text-gray-400 font-[family-name:var(--font-rubik)]">No platforms found for this country.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-7 mt-6">
      {/* Left panel */}
      <div className="flex flex-col gap-4">
        <h2
          ref={nameRef}
          className="txt-fade txt-visible font-[family-name:var(--font-open-sans)] font-black uppercase leading-none text-[#282828]"
          style={{ fontSize: "clamp(16px,2.5vw,36px)", letterSpacing: "-0.02em" }}
        >{items[0]?.name ?? "Featured Platforms"}</h2>
        <p
          ref={descRef}
          className="txt-fade txt-visible font-[family-name:var(--font-rubik)] text-[13px] md:text-[16px] leading-[1.75] text-[#555]"
          style={{ transitionDelay: ".05s" }}
        >{platformDescriptions[items[0]?.name] ?? platformDescriptions["ALL"]}</p>
        <div className="txt-fade txt-visible flex items-center gap-3" style={{ transitionDelay: ".1s" }}>
          <span
            ref={badgeRef}
            className="font-[family-name:var(--font-open-sans)] text-[11px] font-bold tracking-[2px] uppercase bg-[#a10000] text-white px-3.5 py-1 rounded-full"
          >{items[0]?.country ?? ""}</span>
          <span className="font-[family-name:var(--font-open-sans)] text-[11px] text-[#888] tracking-[0.04em]">Marketplace Partner</span>
        </div>
      </div>
      {/* Slider */}
      <div className="relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(255,255,255,0.95), transparent)" }} />
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto py-5 pl-1 select-none"
          style={{ scrollBehavior: "auto", cursor: "grab", touchAction: "pan-x" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {looped.map((p, i) => {
            let realI: number;
            if (i === 0) realI = count - 1;
            else if (i === count + 1) realI = 0;
            else realI = i - 1;
            // Only the real slot (not clones) gets the active highlight
            const isClone  = i === 0 || i === count + 1;
            const isActive = !isClone && realI === activeIdx;
            return (
              <div
                key={p.name + "-" + i}
                className="flex-shrink-0 rounded-[20px] overflow-hidden relative transition-all duration-300"
                style={{
                  width: cardSize,
                  height: cardSize,
                  transform: isActive ? "scale(1)" : "scale(0.92)",
                  opacity:   isActive ? 1 : 0.65,
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "6px 6px 18px rgba(0,0,0,0.13), 2px 2px 6px rgba(0,0,0,0.07)"
                    : "3px 3px 10px rgba(0,0,0,0.08), 1px 1px 4px rgba(0,0,0,0.05)",
                }}
                onClick={() => {
                  if (!isDragging.current) {
                    navigate(activeRef.current, realI);
                    scheduleAuto(realI);
                  }
                }}
              >
                {/* Country badge — top-right corner */}
                <div
                  className="absolute top-3 right-3 z-10 font-[family-name:var(--font-open-sans)] font-black text-[11px] tracking-[2px] uppercase px-2.5 py-1 rounded-lg"
                  style={{
                    color: "#a10000",
                    background: "rgba(161,0,0,0.08)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(161,0,0,0.15)",
                  }}
                >{p.country}</div>
                <div className="w-full bg-white flex items-center justify-center p-5" style={{ height: "72%" }}>
                  <img src={p.image} alt={p.name} draggable={false} className="w-full h-full object-contain pointer-events-none block" />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb]"
                  style={{ height: "28%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 18px" }}
                >
                  <div className="font-[family-name:var(--font-poppins)] font-black uppercase tracking-[0.03em] leading-none mb-1" style={{ color: "#1a1a1a", fontSize: "20px" }}>{p.name}</div>
                  <p className="font-[family-name:var(--font-rubik)] font-normal text-[13px]" style={{ color: "#555" }}>Marketplace Partner</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHOW-MORE BUTTON
───────────────────────────────────────────── */
function ShowMoreBtn({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <button
      className={`show-more-btn inline-flex items-center gap-2 px-8 py-3 rounded-xl border-[1.5px] border-gray-300 bg-white font-[family-name:var(--font-open-sans)] text-[12px] font-bold tracking-[0.07em] uppercase text-gray-500 cursor-pointer transition-all hover:border-[#a10000] hover:text-[#a10000]${expanded ? " expanded" : ""}`}
      onClick={onClick}
    >
      {expanded ? "Show Less" : "Show More"}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────
   TAB NAV (shared)
───────────────────────────────────────────── */
function TabNav({ active, onTabSwitch }: { active: string; onTabSwitch: (t: string) => void }) {
  const tabs = [
    { key: "platforms",  label: "Platforms" },
    { key: "tools",      label: "Tools" },
    { key: "industries", label: "Industries" },
  ];
  return (
    <nav className="flex items-center gap-1 mb-5 anim-up">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onTabSwitch(t.key)}
          className={`relative px-4 py-1.5 font-[family-name:var(--font-open-sans)] text-[13px] font-semibold tracking-[0.02em] cursor-pointer rounded-md transition-all duration-200 whitespace-nowrap border-none
            ${active === t.key
              ? "text-[#282828] bg-black/[0.08]"
              : "text-gray-400 bg-transparent hover:text-gray-700 hover:bg-black/[0.04]"
            }`}
        >{t.label}</button>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   TAB: PLATFORMS
───────────────────────────────────────────── */
function TabPlatforms({ onTabSwitch }: { onTabSwitch: (tab: string) => void }) {
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);

  usePlatformsMosaic(stageRef as React.RefObject<HTMLDivElement>, wrapRef as React.RefObject<HTMLDivElement>);
  useScrollAnims();

  const filteredPlatforms = (selectedCountry === "ALL" ? platforms : platforms.filter(p => p.country === selectedCountry))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const headingText = selectedCountry === "ALL" ? "Our Platform Partners" : countryNames[selectedCountry];
  const subText = selectedCountry === "ALL"
    ? "Over the years, we've built working relationships with 115+ leading e-commerce platforms — from global giants to regional powerhouses — across 24 countries. Swipe to explore the full network."
    : `Explore the active marketplace partners we've worked with in ${countryNames[selectedCountry]}. Each platform represents hands-on catalog management and listing expertise delivered by our team.`;

  return (
    <>
      {/* HERO */}
      <section className="bg-[#f7f7f7] overflow-hidden pt-32 md:pt-35 px-6 pb-0 flex items-center min-h-[820px] md:min-h-[800px]">
        <div className="flex flex-col items-center justify-center w-full max-w-[1280px] mx-auto h-full">
          {/* Text block */}
          <div className="flex flex-col items-center text-center w-full max-w-[1020px] relative z-[2] pb-12">

            <div className="relative z-[1] flex flex-col items-center w-full">
              <TabNav active="platforms" onTabSwitch={onTabSwitch} />
              <p className="anim-up text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000] font-[family-name:var(--font-open-sans)]">PLATFORM ECOSYSTEM</p>
              <div className="relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[38%] font-[family-name:var(--font-barlow-condensed)] font-black uppercase pointer-events-none select-none leading-none text-center z-0 w-full opacity-10"
                  style={{ fontSize: "clamp(60px,20vw,160px)", letterSpacing: "-0.02em" }}
                >
                  <span style={{ WebkitTextStroke: "1px #282828", WebkitTextFillColor: "transparent", opacity: 0.85 } as React.CSSProperties}>
                    PLATFORM OVERVIEW
                  </span>
                </div>
                <h1
                  className="anim-up font-[family-name:var(--font-poppins)] font-black uppercase text-[#282828] mb-5 relative z-[1]"
                  style={{ letterSpacing: "-0.02em", lineHeight: ".95", fontSize: "clamp(26px,6vw,48px)" }}
                >
                  Powering Growth Across 115+<br />
                  <em className="text-[#a10000] not-italic">Global E-Commerce Platforms</em>
                </h1>
              </div>
              <p className="anim-up-2 max-w-[560px] mb-7 font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] leading-[1.75] text-[#282828]/55">
                Over a decade of managed listings, catalog operations, and marketplace expertise across{" "}
                <strong className="text-[#282828] font-semibold">the world's leading e-commerce ecosystems.</strong>{" "}
                Operating across 24 countries with over a decade of marketplace expertise.
              </p>
              <div className="anim-up-3 text-[12px] tracking-[0.04em] text-[#aaa] font-[family-name:var(--font-open-sans)]">
                Home&nbsp;&gt;&gt;&nbsp;About&nbsp;&gt;&gt;&nbsp;<span className="text-[#a10000]">Platform Overview</span>
              </div>
            </div>
          </div>
          {/* Mosaic */}
          <div className="w-full relative overflow-hidden max-w-[1200px]" style={{ height: 220 }}>
            <div ref={wrapRef} className="absolute inset-0 overflow-hidden select-none touch-none">
              <div className="absolute left-0 top-0 bottom-0 w-[120px] z-[20] pointer-events-none" style={{ background: "linear-gradient(to right, #f7f7f7 20%, transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-[120px] z-[20] pointer-events-none" style={{ background: "linear-gradient(to left, #f7f7f7 20%, transparent)" }} />
              <div ref={stageRef} className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 0, height: 200 }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS + ABOUT */}
      <section className="bg-[#f7f7f7] py-12 px-5 md:py-[72px] md:px-10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Stat cards */}
          <div className="order-2 md:order-1 flex gap-3 items-start">
            {/* col 1 */}
            <div className="flex-1 flex flex-col gap-3">
              {/* red card */}
              <div className="relative overflow-hidden rounded-2xl p-4 pb-4 md:p-6 md:pb-5 flex flex-col justify-between min-h-[104px] md:min-h-[130px] cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] bg-[#a10000]" style={{ boxShadow: "0 4px 18px rgba(161,0,0,0.20)" }}>
                <div className="absolute bottom-[-10px] right-[-6px] font-[family-name:var(--font-barlow-condensed)] font-black text-[52px] md:text-[72px] leading-none tracking-[-0.04em] pointer-events-none whitespace-nowrap select-none text-white/[0.08]">115+</div>
                <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L7.9 4.4L11 4.85L8.75 7.05L9.3 10.15L6.5 8.65L3.7 10.15L4.25 7.05L2 4.85L5.1 4.4L6.5 1.5Z" fill="white" opacity="0.9"/></svg>
                </div>
                <div className="font-[family-name:var(--font-barlow-condensed)] font-black leading-none tracking-[-0.02em] text-white relative" style={{ fontSize: "clamp(28px,7vw,52px)" }}>115+</div>
                <div className="text-[11px] md:text-[12px] font-normal leading-[1.5] md:leading-[1.8] tracking-[0.04em] mt-3 md:mt-5 relative whitespace-pre-line font-[family-name:var(--font-rubik)] text-white/80">{"E-commerce platforms successfully\nmanaged and optimized"}</div>
              </div>
              {/* white card */}
              <div className="relative overflow-hidden rounded-2xl p-4 pb-4 md:p-6 md:pb-5 flex flex-col justify-between min-h-[104px] md:min-h-[130px] cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] bg-white" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
                <div className="absolute bottom-[-10px] right-[-6px] font-[family-name:var(--font-barlow-condensed)] font-black text-[52px] md:text-[72px] leading-none tracking-[-0.04em] pointer-events-none whitespace-nowrap select-none text-black/[0.04]">10+</div>
                <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center bg-[#a10000]/[0.07]">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="#a10000" strokeWidth="1.5"/><path d="M6.5 4.5v2l1.2 1.2" stroke="#a10000" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="font-[family-name:var(--font-barlow-condensed)] font-black leading-none tracking-[-0.02em] text-[#282828] relative" style={{ fontSize: "clamp(28px,7vw,52px)" }}>10+</div>
                <div className="text-[11px] md:text-[12px] font-normal leading-[1.5] md:leading-[1.8] tracking-[0.04em] mt-3 md:mt-5 relative whitespace-pre-line font-[family-name:var(--font-rubik)] text-[#999]">{"Years of hands-on marketplace\nexperience"}</div>
              </div>
            </div>
            {/* col 2 offset */}
            <div className="flex-1 flex flex-col gap-3 pt-5 md:pt-8">
              {/* white card */}
              <div className="relative overflow-hidden rounded-2xl p-4 pb-4 md:p-6 md:pb-5 flex flex-col justify-between min-h-[104px] md:min-h-[130px] cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] bg-white" style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
                <div className="absolute bottom-[-10px] right-[-6px] font-[family-name:var(--font-barlow-condensed)] font-black text-[52px] md:text-[72px] leading-none tracking-[-0.04em] pointer-events-none whitespace-nowrap select-none text-black/[0.04]">24</div>
                <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center bg-[#a10000]/[0.07]">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5" r="2.2" stroke="#a10000" strokeWidth="1.4"/><path d="M2.5 11.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#a10000" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
                <div className="font-[family-name:var(--font-barlow-condensed)] font-black leading-none tracking-[-0.02em] text-[#282828] relative" style={{ fontSize: "clamp(28px,7vw,52px)" }}>24</div>
                <div className="text-[11px] md:text-[12px] font-normal leading-[1.5] md:leading-[1.8] tracking-[0.04em] mt-3 md:mt-5 relative whitespace-pre-line font-[family-name:var(--font-rubik)] text-[#999]">{"Countries with active\nmarketplace operations"}</div>
              </div>
              {/* pink card */}
              <div className="relative overflow-hidden rounded-2xl p-4 pb-4 md:p-6 md:pb-5 flex flex-col justify-between min-h-[104px] md:min-h-[130px] cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] bg-[#f9eded]" style={{ boxShadow: "0 4px 18px rgba(161,0,0,0.08)" }}>
                <div className="absolute bottom-[-10px] right-[-6px] font-[family-name:var(--font-barlow-condensed)] font-black text-[52px] md:text-[72px] leading-none tracking-[-0.04em] pointer-events-none whitespace-nowrap select-none text-[#a10000]/10">5★</div>
                <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center bg-[#a10000]/[0.09]">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L7.9 4.4L11 4.85L8.75 7.05L9.3 10.15L6.5 8.65L3.7 10.15L4.25 7.05L2 4.85L5.1 4.4L6.5 1.5Z" fill="#a10000" opacity="0.85"/></svg>
                </div>
                <div className="font-[family-name:var(--font-barlow-condensed)] font-black leading-none tracking-[-0.02em] text-[#a10000] relative" style={{ fontSize: "clamp(28px,7vw,52px)" }}>5★</div>
                <div className="text-[11px] md:text-[12px] font-normal leading-[1.5] md:leading-[1.8] tracking-[0.04em] mt-3 md:mt-5 relative whitespace-pre-line font-[family-name:var(--font-rubik)] text-[#a10000]">{"Client satisfaction across\nglobal engagements"}</div>
              </div>
            </div>
          </div>
          {/* About text */}
          <div className="order-1 md:order-2">
            <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000] font-[family-name:var(--font-open-sans)]">OUR GLOBAL EXPERIENCE</p>
            <h2 className="scroll-anim font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-[1.05] mb-6" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,3.5vw,44px)" }}>
              A Decade of<br />Marketplace Excellence
            </h2>
            <p className="scroll-anim-2 font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#555] leading-[1.8] mb-5">
              For over 4 years, Telex Philippines has partnered with leading global marketplaces — from industry giants like{" "}
              <strong className="text-[#282828]">Amazon, eBay, and Walmart</strong> to high-performing regional platforms across Europe, the Middle East, and Asia.
            </p>
            <p className="scroll-anim-3 font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#555] leading-[1.8] mb-8">
              We specialize in end-to-end marketplace operations, including product listing optimization, catalog management, and platform integrations — enabling brands to scale efficiently and compete globally.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1 h-px bg-[#e0e0e0]" />
              <span className="font-[family-name:var(--font-open-sans)] text-[11px] text-[#bbb] tracking-[0.04em] whitespace-nowrap">Trusted by brands operating in 24+ countries worldwide.</span>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM SLIDER SECTION */}
      <section className="relative py-20 pt-24" style={{
        backgroundImage: `url("/images/bgplatform.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/85 pointer-events-none" />
        <div className="relative z-[1] max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <span className="inline-block text-[11px] md:text-[16px] tracking-[4px] uppercase font-bold text-white font-[family-name:var(--font-open-sans)] mb-3 bg-[#a10000] px-3 py-1 rounded-md">GLOBAL MARKETPLACE NETWORK</span>
              <h2 className="scroll-anim font-[family-name:var(--font-poppins)] font-bold uppercase text-[#1a1a1a] leading-none flex items-center gap-3 flex-wrap" style={{ fontSize: "clamp(20px,3vw,48px)", letterSpacing: "-0.02em" }}>
                {headingText}
                {selectedCountry !== "ALL" && countryFlag[selectedCountry] && (
                  <img
                    src={`https://flagcdn.com/h40/${countryFlag[selectedCountry]}.png`}
                    alt={countryNames[selectedCountry]}
                    style={{ height: "0.75em", width: "auto", display: "inline-block", borderRadius: "3px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", verticalAlign: "middle", marginBottom: "0.1em" }}
                  />
                )}
              </h2>
              <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#555] mt-2.5 max-w-[440px] leading-[1.7]">{subText}</p>
            </div>
            {/* Dropdown */}
            <div className="relative flex-shrink-0 ml-auto md:ml-0" ref={dropdownRef}>
              <button
                className={`flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3.5 border-2 rounded-xl text-[11px] md:text-[12px] font-bold tracking-[0.07em] uppercase md:min-w-[220px] justify-between cursor-pointer transition-all duration-200 font-[family-name:var(--font-open-sans)] whitespace-nowrap
                  ${dropdownOpen
                    ? "bg-[#f0f0f0] text-[#1a1a1a] border-[#1a1a1a]"
                    : "bg-white text-[#1a1a1a] border-[#1a1a1a]/30 hover:border-[#1a1a1a]/60 hover:bg-[#f5f5f5]"
                  }`}
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(o => !o)}
              >
                <span>{selectedCountry === "ALL" ? "All Countries" : `${selectedCountry} — ${countryNames[selectedCountry]}`}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: dropdownOpen ? "rotate(180deg)" : undefined, transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="dd-fade absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e0e0e0] rounded-[14px] z-[300] min-w-[260px] max-h-[340px] overflow-y-auto" style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.15)", scrollbarWidth: "thin", scrollbarColor: "#ccc #fff" }}>
                  {COUNTRIES.map(c => {
                    const count = c === "ALL" ? platforms.length : platforms.filter(p => p.country === c).length;
                    if (count === 0 && c !== "ALL") return null;
                    return (
                      <button
                        key={c}
                        className={`flex items-center justify-between w-full px-[22px] py-[11px] text-left font-[family-name:var(--font-open-sans)] text-[12px] font-bold tracking-[0.06em] uppercase border-l-[3px] cursor-pointer transition-all duration-150 whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] hover:text-[#1a1a1a]
                          ${selectedCountry === c
                            ? "border-l-[#a10000] text-[#1a1a1a] bg-[#a10000]/[0.06]"
                            : "border-l-transparent text-[#555]"
                          }`}
                        style={{ borderTop: "none", borderRight: "none", borderBottom: "none" }}
                        onClick={() => { setSelectedCountry(c); setDropdownOpen(false); }}
                      >
                        <span>{c === "ALL" ? "All Countries" : `${c} — ${countryNames[c]}`}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedCountry === c ? "bg-[#a10000]/20 text-[#a10000]" : "bg-[#f0f0f0] text-[#888]"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <PlatformSlider items={filteredPlatforms} selectedCountry={selectedCountry} />

          <p className="font-[family-name:var(--font-rubik)] text-[13px] text-[#888] text-center mt-4">
            Showing <strong className="text-[#1a1a1a]">{filteredPlatforms.length}</strong> platform{filteredPlatforms.length !== 1 ? "s" : ""}
            {selectedCountry !== "ALL" && ` in ${countryNames[selectedCountry]}`}
          </p>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[#f5f5f5] py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] md:text-[14px] tracking-[4px] uppercase font-bold text-[#a10000] font-[family-name:var(--font-open-sans)] mb-2.5">Why Choose Telex</p>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,4vw,48px)" }}>DRIVING GLOBAL E-COMMERCE PERFORMANCE AT SCALE</h2>
            <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#666] leading-[1.7] mt-4 max-w-[560px] mx-auto">We combine marketplace expertise, advanced technology, and localized execution to help brands expand, optimize, and lead across the world's most competitive e-commerce platforms.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#a10000" strokeWidth="2"/><path d="M8 14l4 4 8-8" stroke="#a10000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Enterprise-Grade Integrations", text: "Seamlessly connect with 115+ global marketplaces through certified partnerships and robust API integrations built for scale and reliability." },
              { icon: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="16" rx="3" stroke="#a10000" strokeWidth="2"/><path d="M9 14h10M14 10v8" stroke="#a10000" strokeWidth="2" strokeLinecap="round"/></svg>, title: "Catalog Operations", text: "From onboarding and content optimization to pricing and inventory management, we handle the full product lifecycle with precision." },
              { icon: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M14 3l2.7 5.6 6.3.9-4.6 4.4 1.1 6.1L14 17.1 8.5 20l1.1-6.1L5 9.5l6.3-.9L14 3z" stroke="#a10000" strokeWidth="2" strokeLinejoin="round"/></svg>, title: "Data-Led Growth Strategy", text: "Leverage actionable insights, performance analytics, and continuous optimization to maximize visibility, conversion, and revenue." },
              { icon: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#a10000" strokeWidth="2"/><path d="M10 14a4 4 0 108 0 4 4 0 00-8 0z" stroke="#a10000" strokeWidth="2"/></svg>, title: "Global Reach, Local Expertise", text: "Operate confidently across 24+ countries with region-specific strategies tailored to local marketplaces, languages, and consumer behavior." },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[18px] p-7 border border-[#ebebeb] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#a10000]/[0.07] flex items-center justify-center flex-shrink-0">{card.icon}</div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-bold text-[12px] uppercase tracking-[0.03em] text-[#282828] leading-[1.2]">{card.title}</h3>
                </div>
                <p className="font-[family-name:var(--font-rubik)] text-[14px] text-[#777] leading-[1.7]">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────
   TAB: TOOLS
───────────────────────────────────────────── */
const TOOL_CARDS = [
  { cat: "catalog",  thumb: "pink",  abbr: "Bb", cat_label: "Catalog",        name: "Babel",        desc: "Translation and localization for multilingual catalog content.",                        image: "/images/Tools Logo/babel.png" },
  { cat: "comms",    thumb: "dark",  abbr: "Br", cat_label: "Communication",  name: "Bria",         desc: "VoIP communication tool for client-facing and internal calls.",                        image: "/images/Tools Logo/bria.png" },
  { cat: "security", thumb: "pink",  abbr: "Cv", cat_label: "Security",       name: "CATO VPN",     desc: "Cloud-native network security and secure access edge.",                                 image: "/images/Tools Logo/cato.png" },
  { cat: "security", thumb: "red",   abbr: "Cx", cat_label: "Security",       name: "Citrix",       desc: "Secure virtual desktop infrastructure for remote operations.",                          image: "/images/Tools Logo/citrix.png" },
  { cat: "catalog",  thumb: "light", abbr: "Xl", cat_label: "Catalog",        name: "Excel",        desc: "Spreadsheet-based catalog tracking and data workflows.",                               image: "/images/Tools Logo/exc.png" },
  { cat: "pm",       thumb: "pink",  abbr: "Jr", cat_label: "Project Mgmt",   name: "Jira",         desc: "Agile project tracking and sprint management for ops teams.",                          image: "/images/Tools Logo/jira.png" },
  { cat: "analytics",thumb: "red",   abbr: "Lk", cat_label: "Analytics & BI", name: "Looker",       desc: "Business intelligence and data visualization for reporting.",                          image: "/images/Tools Logo/looker.png" },
  { cat: "infra",    thumb: "dark",  abbr: "Od", cat_label: "Infrastructure", name: "OneDrive",     desc: "Cloud file storage and document sharing across global teams.",                         image: "/images/Tools Logo/drive.png" },
  { cat: "security", thumb: "light", abbr: "Ok", cat_label: "Security",       name: "Okta",         desc: "Identity and access management for secure team authentication.",                       image: "/images/Tools Logo/okta.png" },
  { cat: "comms",    thumb: "pink",  abbr: "Ol", cat_label: "Communication",  name: "Outlook",      desc: "Enterprise email and calendar coordination across global teams.",                       image: "/images/Tools Logo/outlook.png" },
  { cat: "pm",       thumb: "light", abbr: "Pp", cat_label: "Project Mgmt",   name: "People Plaza", desc: "HR and workforce management system for team operations.",                              image: "" },
  { cat: "catalog",  thumb: "light", abbr: "Pt", cat_label: "Catalog",        name: "Powerpoint",   desc: "Presentation and client reporting tool for business reviews.",                         image: "/images/Tools Logo/ppt.png" },
  { cat: "security", thumb: "red",   abbr: "Sp", cat_label: "Security",       name: "Sailpoint",    desc: "Identity governance and access control for enterprise security.",                      image: "/images/Tools Logo/sail.png" },
  { cat: "catalog",  thumb: "dark",  abbr: "Sf", cat_label: "Catalog",        name: "Salsify",      desc: "Product experience management (PXM) for content syndication.",                        image: "/images/Tools Logo/salsify.png" },
  { cat: "comms",    thumb: "light", abbr: "Sl", cat_label: "Communication",  name: "Slack",        desc: "Channel-based team communication and instant messaging.",                              image: "/images/Tools Logo/slack.png" },
  { cat: "infra",    thumb: "red",   abbr: "Nx", cat_label: "Infrastructure", name: "Nexus",        desc: "Repository manager for artifact storage and build pipelines.",                         image: "/images/Tools Logo/nexus.png" },
  { cat: "comms",    thumb: "dark",  abbr: "Tm", cat_label: "Communication",  name: "Teams",        desc: "Real-time messaging and video collaboration across departments.",                       image: "/images/Tools Logo/teams.png" },
  { cat: "catalog",  thumb: "red",   abbr: "Wd", cat_label: "Catalog",        name: "Word",         desc: "Document creation and SOP documentation for operations teams.",                        image: "/images/Tools Logo/word.png" },
  { cat: "comms",    thumb: "dark",  abbr: "Zd", cat_label: "Communication",  name: "Zendesk",      desc: "Customer support ticketing and communication management.",                             image: "/images/Tools Logo/zendesk.png" },
];

const TOOL_ARC_ICONS = TOOL_CARDS.filter(t => t.image);
const TOOL_ARC_TOP    = TOOL_ARC_ICONS.slice(0, Math.ceil(TOOL_ARC_ICONS.length / 2));
const TOOL_ARC_BOTTOM = TOOL_ARC_ICONS.slice(Math.ceil(TOOL_ARC_ICONS.length / 2));

const TOOL_LOOP_REPEATS = 5;
const TOOL_TOP_TILES    = Array.from({ length: TOOL_LOOP_REPEATS }, () => TOOL_ARC_TOP).flat();
const TOOL_BOTTOM_TILES = Array.from({ length: TOOL_LOOP_REPEATS }, () => TOOL_ARC_BOTTOM).flat();

/* The icons are rendered as plain JSX <img> tags (React handles that reliably,
   same as everywhere else on the page) — this hook only ever touches `transform`
   on the already-rendered nodes every frame. Nothing about image loading/creation
   is done imperatively, so there's nothing here that can leave a card blank. */
function useToolsLoop(containerRef: React.RefObject<HTMLDivElement>, setCount: number, direction: 1 | -1, amplitude: number) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const CARD = 64, GAP = 20, STEP = CARD + GAP;
    const SET_WIDTH = setCount * STEP;
    const TOTAL_WIDTH = children.length * STEP;
    const SPEED = 0.5;

    let offset = 0;
    let rafId: number;
    let lastTime = 0;

    function render() {
      children.forEach((el, i) => {
        const baseX = i * STEP;
        let x = (baseX - offset * direction) % TOTAL_WIDTH;
        if (x < 0) x += TOTAL_WIDTH;
        x -= TOTAL_WIDTH / 2;
        const wave = amplitude * Math.sin(((baseX - offset * direction) / SET_WIDTH) * Math.PI * 2);
        el.style.transform = `translate(${x}px, ${wave}px)`;
      });
    }
    render();

    function animate(ts: number) {
      const dt = lastTime === 0 ? 16 : Math.min(ts - lastTime, 32);
      lastTime = ts;
      offset += SPEED * (dt / 16);
      render();
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function makeSVGLogo(name: string, bg: string, fg: string): string {
  const abbr = name.replace(/[^A-Z0-9]/gi,'').slice(0,3).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bg}"/>
    <text x="100" y="95" font-family="Arial Black,sans-serif" font-size="52" font-weight="900" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${abbr}</text>
    <text x="100" y="148" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${fg}" opacity="0.7" text-anchor="middle">${name}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const TOOLS_MOSAIC_ITEMS: MosaicItem[] = [
  { name: "Babel",      bg: "#f9eded", fg: "#a10000", src: "/images/Tools Logo/babel.png" },
  { name: "Bria",       bg: "#282828", fg: "#ffffff", src: "/images/Tools Logo/bria.png" },
  { name: "CATO VPN",   bg: "#f9eded", fg: "#a10000", src: "/images/Tools Logo/cato.png" },
  { name: "Citrix",     bg: "#1e3a5f", fg: "#ffffff", src: "/images/Tools Logo/citrix.png" },
  { name: "Excel",      bg: "#217346", fg: "#ffffff", src: "/images/Tools Logo/exc.png" },
  { name: "Jira",       bg: "#0052cc", fg: "#ffffff", src: "/images/Tools Logo/jira.png" },
  { name: "Looker",     bg: "#4285f4", fg: "#ffffff", src: "/images/Tools Logo/looker.png" },
  { name: "OneDrive",   bg: "#282828", fg: "#ffffff", src: "/images/Tools Logo/drive.png" },
  { name: "Okta",       bg: "#007dc1", fg: "#ffffff", src: "/images/Tools Logo/okta.png" },
  { name: "Outlook",    bg: "#f9eded", fg: "#a10000", src: "/images/Tools Logo/outlook.png" },
  { name: "Powerpoint", bg: "#f0f0f0", fg: "#282828", src: "/images/Tools Logo/ppt.png" },
  { name: "Sailpoint",  bg: "#a10000", fg: "#ffffff", src: "/images/Tools Logo/sail.png" },
  { name: "Salsify",    bg: "#6e40c9", fg: "#ffffff", src: "/images/Tools Logo/salsify.png" },
  { name: "Slack",      bg: "#4a154b", fg: "#ffffff", src: "/images/Tools Logo/slack.png" },
  { name: "Nexus",      bg: "#a10000", fg: "#ffffff", src: "/images/Tools Logo/nexus.png" },
];

const thumbClass: Record<string,string> = {
  red:   "bg-[#a10000] text-white",
  dark:  "bg-[#282828] text-white",
  light: "bg-[#f0f0f0] text-[#282828]/50",
  pink:  "bg-[#f9eded] text-[#a10000]",
};

function TabTools({ onTabSwitch }: { onTabSwitch: (tab: string) => void }) {
  useSVGMosaic("thm-mosaic", TOOLS_MOSAIC_ITEMS);
  useScrollAnims();

  const toolsTopRef    = useRef<HTMLDivElement>(null);
  const toolsBottomRef = useRef<HTMLDivElement>(null);
  useToolsLoop(toolsTopRef as React.RefObject<HTMLDivElement>, TOOL_ARC_TOP.length, 1, 28);
  useToolsLoop(toolsBottomRef as React.RefObject<HTMLDivElement>, TOOL_ARC_BOTTOM.length, -1, 28);

  return (
    <>
      {/* HERO */}
      <section className="bg-[#f7f7f7] overflow-hidden flex items-center pt-32 md:pt-0 md:min-h-[800px]">
        <div className="flex flex-col md:flex-row items-center w-full max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="flex flex-col justify-center py-10 md:py-20 md:pr-14 relative z-[2] w-full md:w-auto md:flex-none" style={{ maxWidth: "100%" }}>
            <div className="rv rv-up relative z-[1] flex flex-col items-center text-center md:items-start md:text-left">
              <TabNav active="tools" onTabSwitch={onTabSwitch} />
              <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000] font-[family-name:var(--font-open-sans)]">TECHNOLOGY STACK</p>
              <div className="relative w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[38%] font-[family-name:var(--font-barlow-condensed)] font-black uppercase pointer-events-none select-none leading-none z-0 w-full text-center opacity-10" style={{ fontSize: "clamp(60px,20vw,160px)", letterSpacing: "-0.02em" }}>
                  <span style={{ WebkitTextStroke: "1px #282828", WebkitTextFillColor: "transparent", opacity: 0.85 } as React.CSSProperties}>
                    TOOLS &amp; TECH
                  </span>
                </div>
                <h1 className="font-[family-name:var(--font-poppins)] font-black uppercase text-[#282828] mb-5 relative z-[1]" style={{ letterSpacing: "-0.02em", lineHeight: ".95", fontSize: "clamp(26px,5vw,48px)" }}>
                  Powering Operations<br/>with <em className="text-[#a10000] not-italic">20+ Integrated</em><br/><em className="text-[#a10000] not-italic">Tools &amp; Platforms</em>
                </h1>
              </div>
              <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] leading-[1.75] text-[#282828]/55 max-w-[560px] mb-7">From catalog management to CRM and analytics, our team operates across a curated stack of enterprise-grade tools — ensuring seamless execution across every marketplace we serve.</p>
              <div className="text-[12px] tracking-[0.04em] text-[#aaa] font-[family-name:var(--font-open-sans)]">Home&nbsp;&gt;&gt;&nbsp;About&nbsp;&gt;&gt;&nbsp;<span className="text-[#a10000]">Tools Overview</span></div>
            </div>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center py-10 relative overflow-hidden">
            <div className="relative w-full" style={{ height: 420 }} id="thm-mosaic" />
          </div>
        </div>
      </section>

      {/* PLATFORM BACKENDS */}
      <section className="bg-white py-20 border-t border-[#ebebeb]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="rv rv-left flex items-end justify-between flex-wrap gap-5 mb-9">
            <div>
              <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold text-[#a10000] font-[family-name:var(--font-open-sans)] mb-2">PLATFORM BACKENDS</p>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none" style={{ fontSize: "clamp(20px,3vw,48px)", letterSpacing: "-0.02em" }}>Systems We<br/>Operate Inside</h2>
            </div>
          </div>
          <div className="rv-stagger grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Featured */}
            <div className="md:col-span-3 bg-[#282828] rounded-[20px] overflow-hidden flex flex-row items-stretch" style={{ minHeight: 10 }}>
              <div className="bg-[#ffffff] flex items-center justify-center flex-shrink-0 w-[110px] md:w-[200px]">
                <img src="/images/Tools Logo/mirakl.png" alt="Mirakl" className="w-full h-auto object-contain p-4 md:p-5" />
              </div>
              <div className="p-5 md:p-9 flex flex-col justify-center">
                <span className="inline-block font-[family-name:var(--font-open-sans)] text-[9px] md:text-[12px] font-bold tracking-[2px] uppercase bg-white/10 text-white/70 px-2.5 py-1 md:px-3 md:py-1 rounded-full mb-2 md:mb-3.5 w-fit">Flagship Backend</span>
                <div className="font-[family-name:var(--font-poppins)] font-bold uppercase text-white leading-[1.1] md:leading-[1.05] mb-1.5 md:mb-3 text-[12px] md:text-[16px]">Mirakl — The Marketplace Operating System</div>
                <div className="font-[family-name:var(--font-rubik)] text-[11px] md:text-[16px] text-white/55 leading-[1.6] md:leading-[1.7]">Our most-used platform backend. We manage hundreds of thousands of SKUs across Mirakl-powered storefronts in Europe and beyond — from onboarding to live optimization.</div>
              </div>
            </div>
            {[
              { abbr: "AMZ", cls: "bg-[#a10000] text-white", tag: "Global Giant", name: "Amazon Seller Central", desc: "Full catalog operations inside Amazon Seller Central — listing creation, optimization, A+ content, pricing, and inventory management across multiple marketplaces." },
              { abbr: "WMT", cls: "bg-[#282828] text-white/85", tag: "US Market", name: "Walmart Marketplace", desc: "Direct backend access to Walmart Marketplace — managing product listings, pricing strategies, and catalog compliance for US-based clients at scale." },
              { abbr: "50+", cls: "bg-[#f0f0f0] text-[#282828]/50", tag: "Full Network", name: "50+ Platform Backends", desc: "From KAUFLAND, OTTO, and Cdiscount in Europe to Temu, Shein, and BestBuy in the US — our team is trained to operate directly inside every major platform backend." },
            ].map((card, i) => (
              <div key={i} className={`bg-white rounded-2xl border border-[#e8e8e8] p-7 flex flex-col gap-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#a10000]/20`}>
                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center font-[family-name:var(--font-barlow-condensed)] font-black text-[20px] tracking-[-0.02em] flex-shrink-0 ${card.cls}`}>{card.abbr}</div>
                <div>
                  <div className="font-[family-name:var(--font-open-sans)] text-[11px] md:text-[12px] font-bold tracking-[2px] uppercase text-[#a10000] mb-0.5">{card.tag}</div>
                  <div className="font-[family-name:var(--font-poppins)] font-bold text-[14px] md:text-[16px] uppercase tracking-[0.03em] text-[#282828]">{card.name}</div>
                </div>
                <div className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#888] leading-[1.65] mt-auto">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL STACK — continuous scrolling loop (same pool+offset technique as the Platforms mosaic) */}
      <section className="bg-white py-24 border-t border-[#ebebeb] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative">
          <div className="relative overflow-hidden mb-10 md:mb-14" style={{ height: 130 }}>
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
            <div ref={toolsTopRef} className="absolute inset-0">
              {TOOL_TOP_TILES.map((t, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 -mt-8 -ml-8 w-16 h-16 rounded-2xl bg-white border border-[#ebebeb] shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={t.image} alt={t.name} loading="eager" className="w-full h-full object-contain p-2.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="rv rv-scale text-center max-w-[640px] mx-auto relative z-[1]">
            <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold text-[#a10000] font-[family-name:var(--font-open-sans)] mb-3">INTERNAL TOOLS</p>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none mb-4" style={{ fontSize: "clamp(20px,3vw,48px)", letterSpacing: "-0.02em" }}>Our Tool Stack</h2>
            <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#777] leading-[1.7]">A curated ecosystem of 19+ enterprise-grade tools — powering catalog operations, communication, security, and analytics across every marketplace we serve.</p>
          </div>

          <div className="relative overflow-hidden mt-10 md:mt-14" style={{ height: 130 }}>
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
            <div ref={toolsBottomRef} className="absolute inset-0">
              {TOOL_BOTTOM_TILES.map((t, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 -mt-8 -ml-8 w-16 h-16 rounded-2xl bg-white border border-[#ebebeb] shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={t.image} alt={t.name} loading="eager" className="w-full h-full object-contain p-2.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE OPERATE */}
      <section className="bg-[#f7f7f7] py-20 border-t border-[#ebebeb]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div className="rv rv-left">
              <span className="inline-block font-[family-name:var(--font-open-sans)] text-[12px] md:text-[16px] font-bold tracking-[4px] uppercase bg-[#a10000] text-white px-3 py-1 rounded-md mb-3">HOW WE OPERATE</span>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none mb-4 mt-3" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,3.5vw,48px)" }}>From Onboarding<br/>to Live Marketplace</h2>
              <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#777] leading-[1.75] mb-9">A streamlined 5-step process ensures every platform integration is executed consistently and at scale — using the right tool at every stage.</p>
              <div className="flex items-center gap-0 mb-10">
                {[
                  { cls: "bg-[#a10000]", lbl: "CX" },
                  { cls: "bg-[#4b5563]", lbl: "ZD" },
                  { cls: "bg-[#6b7280]", lbl: "OK" },
                  { cls: "bg-[#374151]", lbl: "SF" },
                ].map((av, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#f7f7f7] flex items-center justify-center font-[family-name:var(--font-barlow-condensed)] font-extrabold text-[14px] text-white flex-shrink-0 ${av.cls}`} style={{ marginLeft: i === 0 ? 0 : -10 }}>{av.lbl}</div>
                ))}
                <span className="ml-3.5 font-[family-name:var(--font-rubik)] text-[13px] text-[#999]"><strong className="text-[#282828] font-semibold">19 tools</strong> work together</span>
              </div>
              <div className="tl-steps flex flex-col gap-0">
                {[
                  { title: "Platform Access",  desc: "Secure credentials provisioned via Okta and CATO VPN." },
                  { title: "Catalog Setup",    desc: "Product data structured and normalized using Salsify and Excel." },
                  { title: "Content Push",     desc: "Listings pushed via Mirakl, direct API, or seller portal backend." },
                  { title: "QA & Review",      desc: "Reviewed in Jira workflows and Looker dashboards for accuracy." },
                  { title: "Live & Monitor",   desc: "Performance tracked in Looker; issues escalated via Zendesk & Slack." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 pb-7 relative last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-[#a10000]/[0.08] border-[1.5px] border-[#a10000]/20 flex items-center justify-center flex-shrink-0 relative z-[1]">
                      <div className="w-2 h-2 rounded-full bg-[#a10000]" />
                    </div>
                    <div className="pt-1">
                      <div className="font-[family-name:var(--font-poppins)] font-bold text-[14px] md:text-[16px] uppercase tracking-[0.04em] text-[#282828] mb-1">{step.title}</div>
                      <div className="font-[family-name:var(--font-rubik)] font-normal text-[14px] md:text-[16px] text-[#888] leading-[1.6]">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rv-stagger flex flex-col gap-5">
              {[
                { num: "115+", label: "E-Commerce Platforms",  desc: "Active operations across 115+ marketplace backends globally, each with dedicated team members and established SOPs." },
                { num: "24",   label: "Countries Served",      desc: "Region-specific strategies tailored to local marketplaces, languages, and consumer behavior — from Europe to Southeast Asia." },
                { num: "10+",  label: "Years of Experience",   desc: "Over a decade of hands-on marketplace operations refined into a repeatable, scalable system used by 22+ global brands." },
              ].map((card, i) => (
                <div key={i} className={`bg-white border border-[#ebebeb] rounded-2xl px-8 py-7 transition-all duration-200 hover:border-[#a10000]/25 hover:shadow-lg`} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div className="font-[family-name:var(--font-barlow-condensed)] font-black text-[40px] md:text-[52px] leading-none tracking-[-0.03em] text-[#a10000]">{card.num}</div>
                  <div className="font-[family-name:var(--font-poppins)] font-bold text-[12px] md:text-[14px] tracking-[2px] uppercase text-[#282828] mt-1.5">{card.label}</div>
                  <div className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#888] leading-[1.6] mt-2.5">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY THESE TOOLS */}
      <section className="bg-white py-20 border-t border-[#ebebeb]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold text-[#a10000] font-[family-name:var(--font-open-sans)] mb-3">WHY THESE TOOLS</p>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none mb-4" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,3vw,48px)" }}>Built for Scale,<br/>Precision &amp; Speed</h2>
            <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#888] leading-[1.7]">Every tool in our stack was chosen because it solves a real problem — not because it looked good on a slide. Security, speed, and precision are non-negotiables when operating across 24 countries.</p>
          </div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3.5 px-6 py-4 bg-[#f9f9f9] rounded-[14px] border border-[#ebebeb]">
              <img src="/images/telexlogo.webp" alt="Telex Philippines" className="w-11 h-11 object-contain flex-shrink-0" />
              <div>
                <div className="font-[family-name:var(--font-open-sans)] text-[12px] md:text-[14px] font-bold text-[#282828]">Telex Philippines</div>
                <div className="font-[family-name:var(--font-rubik)] text-[11px] md:text-[12px] text-[#aaa] mt-0.5">Operations &amp; Technology Team</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "Enterprise Security",     desc: "Okta, CATO VPN, and Sailpoint protect client data across every region — with zero compromises on access control.", tag: "Security" },
              { num: "02", title: "Seamless Comms",          desc: "Slack, Teams, Bria, and Outlook keep globally distributed teams aligned with zero gaps across time zones.", tag: "Collaboration" },
              { num: "03", title: "Catalog Precision",       desc: "Salsify and Excel power structured workflows to manage hundreds of thousands of SKUs with consistent output.", tag: "Catalog Ops" },
              { num: "04", title: "Data-Driven Ops",         desc: "Looker gives clients real-time visibility into listing performance, errors, and optimization opportunities.", tag: "Analytics" },
              { num: "05", title: "Project Accountability",  desc: "Jira ensures every task and escalation is tracked — nothing falls through the cracks across 100+ simultaneous operations.", tag: "Project Mgmt" },
              { num: "06", title: "Secure Infrastructure",   desc: "Nexus and OneDrive provide a reliable backbone for artifact management, file sharing, and team-wide document access.", tag: "Infrastructure" },
            ].map((card, i) => (
              <div key={i} className={`scroll-anim${i % 3 === 1 ? "-2" : i % 3 === 2 ? "-3" : ""} rounded-2xl p-7 border border-[#ebebeb] bg-[#fafafa] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#a10000]/20`}>
                <div className="font-[family-name:var(--font-barlow-condensed)] font-black text-[48px] md:text-[64px] leading-none text-[#a10000] mb-3">{card.num}</div>
                <div className="font-[family-name:var(--font-poppins)] font-bold text-[14px] md:text-[16px] uppercase tracking-[0.04em] text-[#282828] mb-2">{card.title}</div>
                <div className="font-[family-name:var(--font-rubik)] text-[13px] md:text-[14px] text-[#777] leading-[1.65]">{card.desc}</div>
                <span className="inline-block mt-3.5 font-[family-name:var(--font-open-sans)] text-[12px] font-bold tracking-[2px] uppercase bg-[#a10000]/[0.07] text-[#a10000] px-2.5 py-1 rounded-full">{card.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────
   TAB: INDUSTRIES
───────────────────────────────────────────── */
const IND_MOSAIC_ITEMS: MosaicItem[] = [
  { name: "Automotive",  bg: "#282828", fg: "#fff", src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop&crop=center" },
  { name: "Electronics", bg: "#282828", fg: "#fff", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center" },
  { name: "Fashion",     bg: "#4b5563", fg: "#fff", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center" },
  { name: "Home & Ergo", bg: "#a10000", fg: "#fff", src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=center" },
  { name: "Kitchen",     bg: "#a10000", fg: "#fff", src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center" },
  { name: "Logistics",   bg: "#d97706", fg: "#fff", src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=400&fit=crop&crop=center" },
  { name: "Medical",     bg: "#0d9488", fg: "#fff", src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&crop=center" },
  { name: "Software",    bg: "#4b5563", fg: "#fff", src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&crop=center" },
  { name: "Specialty",   bg: "#be185d", fg: "#fff", src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop&crop=center" },
  { name: "Travel",      bg: "#2563eb", fg: "#fff", src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop&crop=center" },
];

const VERT_ROWS = [
  { num: "01", name: "Kitchen",             desc: "Cookware, appliances, and kitchen accessories built for modern households.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", chips: ["Akicon","Airmsen","Mr.BBQ"] },
  { num: "02", name: "Electronics",         desc: "Powerbanks, smart lighting, security cameras, and e-cigarette tech.", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop", chips: ["BaseUs","Geekvape","GOVEE","Ezviz"] },
  { num: "03", name: "Fashion Retail",      desc: "Fashion brands spanning bridal couture and performance athleisure.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", chips: ["Azazie","Baleaf"] },
  { num: "04", name: "Home & Ergonomics",   desc: "Ergonomic furniture and home wellness products designed for productivity.", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop", chips: ["Flexispot","BESTOi"] },
  { num: "05", name: "Medical & Healthcare",desc: "Healthcare devices and medical imaging solutions for clinical professionals.", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop", chips: ["Mindray","Coslus"] },
  { num: "06", name: "Automotive",          desc: "Auto parts, car accessories, and child safety products for drivers.", img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop", chips: ["Fridayparts","Diono"] },
  { num: "07", name: "Travel & Gov't",      desc: "Travel documentation and government service solutions for global citizens.", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", chips: ["CGI-Visa","Jettzy"] },
  { num: "08", name: "Logistics",           desc: "End-to-end logistics management and live shipment tracking platforms.", img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop", chips: ["GOFO"] },
  { num: "09", name: "Software",            desc: "Consumer and professional software including PC optimization and security tools.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", chips: ["Avanquest"] },
  { num: "10", name: "Specialty Verticals", desc: "Niche markets spanning eyewear, coolers, micromobility, audio, and hospitality.", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop", chips: ["Jadens","Cooler","3KM Ario","Next Marvel","GNG","MasterOnly"] },
];

const DIR_CARDS = [
  { ind: "kitchen",    avatar: "",        abbr: "AK", name: "Akicon",      industry: "Kitchen and Bath Industry",          badge: "commerce", badgeTxt: "Kitchen" },
  { ind: "software",   avatar: "av-dark", abbr: "AV", name: "Avanquest",   industry: "Software Development",               badge: "tech",     badgeTxt: "Software" },
  { ind: "electronics",avatar: "av-gray", abbr: "EZ", name: "Ezviz",       industry: "Security Home Cameras",              badge: "tech",     badgeTxt: "Electronics" },
  { ind: "medical",    avatar: "av-teal", abbr: "MN", name: "Mindray",     industry: "Medical Imaging Needs",              badge: "health",   badgeTxt: "Medical" },
  { ind: "specialty",  avatar: "av-dark", abbr: "JD", name: "Jadens",      industry: "Thermal Label Printers",             badge: "retail",   badgeTxt: "Specialty" },
  { ind: "home",       avatar: "",        abbr: "FX", name: "Flexispot",   industry: "Ergonomic Furniture & Home",         badge: "commerce", badgeTxt: "Home & Ergo" },
  { ind: "electronics",avatar: "av-dark", abbr: "BU", name: "BaseUs",      industry: "Powerbanks, Chargers & Cables",      badge: "tech",     badgeTxt: "Electronics" },
  { ind: "home",       avatar: "av-gray", abbr: "BE", name: "BESTOi",      industry: "Home Ergonomics",                    badge: "commerce", badgeTxt: "Home & Ergo" },
  { ind: "logistics",  avatar: "av-amber",abbr: "GF", name: "GOFO",        industry: "Logistics, Tracking & Deliveries",   badge: "logistic", badgeTxt: "Logistics" },
  { ind: "electronics",avatar: "av-dark", abbr: "GV", name: "GOVEE",       industry: "Outdoor Lights",                     badge: "tech",     badgeTxt: "Electronics" },
  { ind: "electronics",avatar: "av-gray", abbr: "GK", name: "Geekvape",    industry: "Electronic E-Cigarettes",            badge: "tech",     badgeTxt: "Electronics" },
  { ind: "travel",     avatar: "av-blue", abbr: "CG", name: "CGI-Visa",    industry: "Govt Services / Travel Docs",        badge: "travel",   badgeTxt: "Travel & Gov't" },
  { ind: "fashion",    avatar: "",        abbr: "AZ", name: "Azazie",      industry: "Fashion Retail",                     badge: "retail",   badgeTxt: "Fashion" },
  { ind: "specialty",  avatar: "av-dark", abbr: "3K", name: "3KM Ario",    industry: "Micromobility / Transport Tech",     badge: "retail",   badgeTxt: "Specialty" },
  { ind: "fashion",    avatar: "av-gray", abbr: "BL", name: "Baleaf",      industry: "Fashion Retail",                     badge: "retail",   badgeTxt: "Fashion" },
  { ind: "specialty",  avatar: "av-dark", abbr: "NM", name: "Next Marvel", industry: "Eyewear Accessories",                badge: "retail",   badgeTxt: "Specialty" },
  { ind: "specialty",  avatar: "av-gray", abbr: "CO", name: "Cooler",      industry: "Portable Coolers",                   badge: "retail",   badgeTxt: "Specialty" },
  { ind: "specialty",  avatar: "av-blue", abbr: "GN", name: "GNG",         industry: "Hotel and Booking",                  badge: "travel",   badgeTxt: "Specialty" },
  { ind: "medical",    avatar: "av-teal", abbr: "CS", name: "Coslus",      industry: "Healthcare and Medical Devices",     badge: "health",   badgeTxt: "Medical" },
  { ind: "automotive", avatar: "av-dark", abbr: "FP", name: "Fridayparts", industry: "Automotive",                         badge: "commerce", badgeTxt: "Automotive" },
  { ind: "kitchen",    avatar: "",        abbr: "AI", name: "Airmsen",     industry: "Kitchen Industry",                   badge: "commerce", badgeTxt: "Kitchen" },
  { ind: "automotive", avatar: "av-gray", abbr: "DN", name: "Diono",       industry: "Carseats Accessories",               badge: "commerce", badgeTxt: "Automotive" },
  { ind: "kitchen",    avatar: "",        abbr: "MB", name: "Mr.BBQ",      industry: "Kitchen Industry",                   badge: "commerce", badgeTxt: "Kitchen" },
  { ind: "specialty",  avatar: "av-rose", abbr: "MO", name: "MasterOnly",  industry: "Studio & Speaker Accessories",       badge: "retail",   badgeTxt: "Specialty" },
  { ind: "travel",     avatar: "av-blue", abbr: "JT", name: "Jettzy",      industry: "Travel Air Booking",                 badge: "travel",   badgeTxt: "Travel & Gov't" },
];

const IND_PANELS: Record<string, { accounts: { avatar: string; abbr: string; name: string; desc: string; tag: string }[] }> = {
  kitchen:     { accounts: [
    { avatar: "",         abbr: "AK", name: "Akicon",   desc: "Kitchen and bath fixtures, faucets, and accessories for modern homes.",          tag: "Kitchen" },
    { avatar: "",         abbr: "AI", name: "Airmsen",  desc: "Innovative kitchen appliances and cooking tools built for everyday use.",         tag: "Kitchen" },
    { avatar: "",         abbr: "MB", name: "Mr.BBQ",   desc: "BBQ grills, accessories, and outdoor cooking essentials for enthusiasts.",        tag: "Kitchen" },
  ]},
  electronics: { accounts: [
    { avatar: "av-dark",  abbr: "BU", name: "BaseUs",   desc: "Powerbanks, chargers, and cables engineered for fast, reliable charging.",       tag: "Electronics" },
    { avatar: "av-gray",  abbr: "GK", name: "Geekvape", desc: "Advanced electronic cigarette devices and vaping accessories for adult consumers.", tag: "Electronics" },
    { avatar: "av-dark",  abbr: "GV", name: "GOVEE",    desc: "Smart outdoor and ambient lighting solutions powered by app control and AI.",     tag: "Electronics" },
    { avatar: "av-gray",  abbr: "EZ", name: "Ezviz",    desc: "Home security cameras and smart surveillance systems for residential use.",       tag: "Electronics" },
  ]},
  fashion:     { accounts: [
    { avatar: "",         abbr: "AZ", name: "Azazie",   desc: "Premium bridal gowns, bridesmaid dresses, and event-ready fashion for every occasion.", tag: "Fashion" },
    { avatar: "av-gray",  abbr: "BL", name: "Baleaf",   desc: "Performance athleisure and activewear designed for workouts, yoga, and everyday comfort.", tag: "Fashion" },
  ]},
  home:        { accounts: [
    { avatar: "",         abbr: "FX", name: "Flexispot", desc: "Standing desks, ergonomic chairs, and height-adjustable workstations for modern offices.", tag: "Home & Ergo" },
    { avatar: "av-gray",  abbr: "BE", name: "BESTOi",    desc: "Ergonomic home accessories and wellness products that support comfortable living.", tag: "Home & Ergo" },
  ]},
  medical:     { accounts: [
    { avatar: "av-teal",  abbr: "MN", name: "Mindray",  desc: "Medical imaging systems, patient monitoring, and diagnostic equipment for clinical settings.", tag: "Medical" },
    { avatar: "av-teal",  abbr: "CS", name: "Coslus",   desc: "Consumer healthcare devices including oral care and personal wellness products.", tag: "Medical" },
  ]},
  automotive:  { accounts: [
    { avatar: "av-dark",  abbr: "FP", name: "Fridayparts", desc: "OEM and aftermarket replacement parts for heavy machinery and construction equipment.", tag: "Automotive" },
    { avatar: "av-gray",  abbr: "DN", name: "Diono",        desc: "Child car seats, boosters, and automotive travel accessories engineered for safety.", tag: "Automotive" },
  ]},
  travel:      { accounts: [
    { avatar: "av-blue",  abbr: "CG", name: "CGI-Visa", desc: "Visa application services, government travel documentation, and consular support solutions.", tag: "Gov't" },
    { avatar: "av-blue",  abbr: "JT", name: "Jettzy",   desc: "Online air travel booking platform with competitive fares and flexible itinerary options.", tag: "Travel" },
  ]},
  logistics:   { accounts: [
    { avatar: "av-amber", abbr: "GF", name: "GOFO",      desc: "End-to-end logistics management, live shipment tracking, and delivery solutions for e-commerce brands.", tag: "Logistics" },
  ]},
  software:    { accounts: [
    { avatar: "av-dark",  abbr: "AV", name: "Avanquest", desc: "Consumer and professional software including PC optimization, security, and creative tools.", tag: "Software" },
  ]},
  specialty:   { accounts: [
    { avatar: "av-dark",  abbr: "JD", name: "Jadens",      desc: "Thermal label printers and shipping supplies for warehouses and e-commerce sellers.",  tag: "Specialty" },
    { avatar: "av-gray",  abbr: "CO", name: "Cooler",       desc: "Portable coolers and ice retention products for outdoor and recreational use.",         tag: "Specialty" },
    { avatar: "av-dark",  abbr: "3K", name: "3KM Ario",     desc: "Micromobility and personal transport tech solutions for urban commuters.",               tag: "Specialty" },
    { avatar: "av-dark",  abbr: "NM", name: "Next Marvel",  desc: "Eyewear accessories including lens kits, cases, and optical fashion accessories.",       tag: "Specialty" },
    { avatar: "av-blue",  abbr: "GN", name: "GNG",          desc: "Hotel booking and hospitality solutions for travelers seeking curated accommodations.",   tag: "Specialty" },
    { avatar: "av-rose",  abbr: "MO", name: "MasterOnly",   desc: "Professional studio speakers, audio accessories, and sound equipment for creators.",     tag: "Specialty" },
  ]},
};

const avatarBg: Record<string,string> = {
  "":         "bg-[#a10000]",
  "av-dark":  "bg-[#374151]",
  "av-teal":  "bg-[#0d9488]",
  "av-blue":  "bg-[#2563eb]",
  "av-gray":  "bg-[#4b5563]",
  "av-amber": "bg-[#d97706]",
  "av-rose":  "bg-[#be185d]",
};

const badgeStyle: Record<string,string> = {
  commerce: "bg-[#a10000]/[0.08] text-[#a10000]",
  tech:     "bg-[#282828]/[0.07] text-[#444]",
  retail:   "bg-[#4b5563]/[0.08] text-[#4b5563]",
  health:   "bg-[#0d9488]/[0.08] text-[#0d9488]",
  logistic: "bg-[#d97706]/10 text-[#d97706]",
  travel:   "bg-[#2563eb]/[0.09] text-[#2563eb]",
};

function TabIndustries({ onTabSwitch }: { onTabSwitch: (tab: string) => void }) {
  const [activePanel, setActivePanel] = useState("kitchen");
  const [indDdOpen,   setIndDdOpen]   = useState(false);
  const [activePill,  setActivePill]  = useState("all");
  const [vertExpanded, setVertExpanded] = useState(false);
  const [dirExpanded,  setDirExpanded]  = useState(false);
  const [activeSegFilter, setActiveSegFilter] = useState("all");
  const [autoSegIdx, setAutoSegIdx] = useState(0);
  const [segDdOpen, setSegDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const segFilterRef = useRef<HTMLDivElement>(null);

  useSVGMosaic("ind-hero-mosaic", IND_MOSAIC_ITEMS, "photo");
  useScrollAnims();

  const VERT_LIMIT = 6, DIR_LIMIT = 12;
  const curData = industryData[activePanel];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setIndDdOpen(false);
      if (segFilterRef.current && !segFilterRef.current.contains(e.target as Node)) setSegDdOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-cycle through segments every 5s when filter is "all"
  useEffect(() => {
    if (activeSegFilter !== "all") return;
    const timer = setInterval(() => {
      setAutoSegIdx(prev => (prev + 1) % 10);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSegFilter]);

  const indPills = ["all","kitchen","electronics","fashion","home","medical","automotive","travel","logistics","software","specialty"];
  const pillLabels: Record<string,string> = { all:"All", kitchen:"Kitchen", electronics:"Electronics", fashion:"Fashion", home:"Home & Ergo", medical:"Medical", automotive:"Automotive", travel:"Travel & Gov't", logistics:"Logistics", software:"Software", specialty:"Specialty" };

  const filteredDir = activePill === "all" ? DIR_CARDS : DIR_CARDS.filter(c => c.ind === activePill);
  const visibleDir  = dirExpanded  ? filteredDir : filteredDir.slice(0, DIR_LIMIT);
  const visibleVert = vertExpanded ? VERT_ROWS   : VERT_ROWS.slice(0, VERT_LIMIT);

  const ddItems = [
    { panel: "kitchen",    label: "Kitchen",       count: 3 },
    { panel: "electronics",label: "Electronics",   count: 4 },
    { panel: "fashion",    label: "Fashion Retail",count: 2 },
    { panel: "home",       label: "Home & Ergo",   count: 2 },
    { panel: "medical",    label: "Medical",        count: 2 },
    { panel: "automotive", label: "Automotive",     count: 2 },
    { panel: "travel",     label: "Travel & Gov't", count: 2 },
    { panel: "logistics",  label: "Logistics",      count: 1 },
    { panel: "software",   label: "Software",       count: 1 },
    { panel: "specialty",  label: "Specialty",      count: 6 },
  ];

  const INDUSTRY_SEGMENTS = [
    { icon: "🍳", title: "Kitchen & Home Essentials",          brands: "Akicon, Airmsen, Mr.BBQ",                         desc: "We support kitchen-focused brands ranging from functional home solutions to outdoor cooking systems. These products demand strong visual presentation, accurate specifications, and consistent catalog structure across platforms." },
    { icon: "💻", title: "Electronics & Smart Devices",        brands: "BaseUs, Govee, Ezviz, Geekvape, MasterOnly",      desc: "From smart lighting and security cameras to power solutions and audio equipment, electronics brands require precision. We ensure accurate technical specs, compatibility data, and optimized listings across multiple marketplaces." },
    { icon: "👗", title: "Fashion & Lifestyle Retail",         brands: "Azaire, Baleaf",                                  desc: "Fashion operates at speed. We manage product data, variations, and content updates to keep up with trends while maintaining consistency in sizing, visuals, and descriptions." },
    { icon: "🪑", title: "Home, Furniture & Ergonomics",       brands: "Flexispot, BESTQi",                               desc: "This segment focuses on comfort, productivity, and lifestyle upgrades. We handle detailed product attributes such as dimensions, materials, and ergonomic features — ensuring clarity for both B2B and B2C buyers." },
    { icon: "🏥", title: "Healthcare & Medical Technology",    brands: "Mindray, Coslus",                                 desc: "Healthcare products require strict accuracy and compliance. From medical imaging to personal care devices, we manage sensitive product data with precision and reliability." },
    { icon: "🚗", title: "Automotive & Mobility",              brands: "Fridayparts, Diono, 3KM Ario",                   desc: "This category includes auto parts, safety accessories, and micromobility solutions. We ensure compatibility accuracy, technical clarity, and proper categorization across platforms." },
    { icon: "✈️", title: "Travel, Hospitality & Gov't",        brands: "GING, Jetzzy, CGI-Visa",                          desc: "We support platforms that enable movement — whether it's booking travel or processing documentation. These services require seamless integration, real-time data handling, and user-focused content." },
    { icon: "📦", title: "Logistics & Delivery Technology",    brands: "GOFO",                                            desc: "Logistics platforms are the backbone of e-commerce. We help maintain structured data and system clarity for tracking, delivery, and operational visibility." },
    { icon: "🧠", title: "Software & Digital Solutions",       brands: "Avanquest",                                       desc: "Software products require clear differentiation — versions, licenses, and features must be accurately presented to avoid confusion and ensure compliance." },
    { icon: "🧩", title: "Specialized & Niche Products",       brands: "Jadens, Next Marvel, Cooler",                    desc: "This category includes unique products such as thermal printers, eyewear accessories, and portable cooling solutions. Each requires a tailored approach to positioning, content, and marketplace strategy." },
  ];

  const FRAMEWORK_PILLARS = [
    { label: "Structured & Scalable Product Data",      desc: "Every brand gets a catalog framework built for volume — clean attributes, consistent formats, and replicable workflows." },
    { label: "Platform-Specific Optimization",          desc: "We adapt content and structure to each marketplace's unique requirements, algorithms, and buyer expectations." },
    { label: "Consistent & Compliant Listings",         desc: "From regulatory requirements to brand guidelines, we ensure every listing meets the standard — no exceptions." },
    { label: "Adaptability to Market Requirements",     desc: "Industries evolve. We stay ahead of category changes, platform policy updates, and market shifts to keep listings competitive." },
  ];

  return (
    <>
      {/* ── HERO ── keep mosaic + TabNav, update copy with Poppins headline */}
      <section className="bg-[#f7f7f7] overflow-hidden flex items-center pt-32 md:pt-0 md:min-h-[800px]">
        <div className="flex flex-col md:flex-row items-center w-full max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="flex flex-col justify-center py-10 md:py-20 md:pr-14 relative z-[2] w-full md:w-auto md:flex-none" style={{ maxWidth: "100%" }}>
            <div className="relative z-[1] flex flex-col items-center text-center md:items-start md:text-left">
              <TabNav active="industries" onTabSwitch={onTabSwitch} />
              <p className="anim-up text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-4 text-[#a10000] font-[family-name:var(--font-open-sans)]">BEYOND CATEGORIES</p>
              <div className="relative w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[38%] font-[family-name:var(--font-barlow-condensed)] font-black uppercase pointer-events-none select-none leading-none z-0 w-full text-center opacity-10 text-[clamp(44px,15vw,100px)] md:text-[clamp(60px,20vw,160px)]" style={{ letterSpacing: "-0.02em" }}>
                  <span style={{ WebkitTextStroke: "1px #282828", WebkitTextFillColor: "transparent", opacity: 0.85 } as React.CSSProperties}>
                    INDUSTRIES OVERVIEW
                  </span>
                </div>
                <h1
                  className="anim-up font-[family-name:var(--font-poppins)] font-black uppercase text-[#282828] mb-5 relative z-[1]"
                  style={{ lineHeight: ".95", fontSize: "clamp(32px,8vw,48px)", letterSpacing: "-0.02em" }}
                >
                  Industries<br />
                  <span className="text-[#a10000]">We Power</span>
                </h1>
              </div>
              <p className="anim-up-2 max-w-[520px] mb-4 font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] leading-[1.75] text-[#282828]/55">
                We don't just work with industries — we operate within their complexities. From kitchen hardware and electronics to healthcare, logistics, and travel services, our experience spans a diverse ecosystem of brands.
              </p>
              <p className="anim-up-2 max-w-[480px] mb-7 font-[family-name:var(--font-rubik)] text-[12px] md:text-[13px] leading-[1.7] text-[#282828]/40 italic">
                Every industry requires a different strategy. We bring the structure, scalability, and precision needed to make each one succeed.
              </p>
              <div className="anim-up-3 text-[12px] tracking-[0.04em] text-[#aaa] font-[family-name:var(--font-open-sans)]">
                Home&nbsp;&gt;&gt;&nbsp;About&nbsp;&gt;&gt;&nbsp;<span className="text-[#a10000]">Industries Overview</span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center py-6 md:py-10 relative overflow-hidden w-full">
            <div className="relative w-full h-[260px] md:h-[420px]" id="ind-hero-mosaic" />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: A MULTI-INDUSTRY ECOSYSTEM ── */}
      <section className="bg-white py-20 border-t border-[#ebebeb]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* stacked image collage — keep existing visual */}
            <div className="scroll-anim relative h-[300px] md:h-[400px] order-last md:order-none mt-2 md:mt-0">
              {[
                { cls: "absolute left-0 top-0 z-[2]", style: { width:"58%", height:"60%", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.14)" }, src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", alt: "Kitchen" },
                { cls: "absolute right-0 top-0 z-[1]", style: { width:"45%", height:"48%", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.14)" }, src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", alt: "Tech" },
                { cls: "absolute z-[3]",               style: { left:"8%", bottom:0, width:"50%", height:"44%", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.14)", border:"4px solid #fff" }, src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=360&fit=crop", alt: "Fashion" },
                { cls: "absolute right-0 z-[2]",       style: { bottom:"14%", width:"38%", height:"38%", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.14)" }, src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=350&h=280&fit=crop", alt: "Medical" },
              ].map((img, i) => (
                <div key={i} className={img.cls} style={img.style}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* floating stat pill */}
              <div className="absolute bottom-[-18px] left-[32%] z-[10] bg-[#a10000] text-white px-4 py-2.5 md:px-5 md:py-3 rounded-[14px] flex items-center gap-2 md:gap-3 shadow-xl">
                <span className="font-[family-name:var(--font-open-sans)] font-black text-[20px] md:text-[26px] leading-none">10</span>
                <span className="font-[family-name:var(--font-rubik)] text-[9px] md:text-[11px] leading-[1.4] opacity-80">Active<br/>Industries</span>
              </div>
            </div>

            <div className="scroll-anim-2">
              <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-3 text-[#a10000] font-[family-name:var(--font-open-sans)]">A MULTI-INDUSTRY ECOSYSTEM</p>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none mb-5" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,3.5vw,48px)" }}>One Portfolio.<br/>Many Complexities.</h2>
              <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#777] leading-[1.85] mb-6">
                Our portfolio is built across a wide spectrum of industries, allowing us to adapt to different business models, compliance requirements, and customer behaviors. Instead of treating industries as isolated segments, we approach them as interconnected ecosystems — where operational efficiency, catalog accuracy, and platform performance must align.
              </p>
              <div className="flex gap-5 flex-wrap">
                {[{ val:"22+", lbl:"Accounts"}, { val:"10", lbl:"Verticals"}, { val:"B2B", lbl:"Model"}].map((s,i) => (
                  <div key={i} className="flex flex-col items-start px-4 py-3 md:px-5 md:py-4 rounded-[14px] bg-[#f7f7f7] border border-[#ebebeb] min-w-[70px] md:min-w-[88px]">
                    <span className="font-[family-name:var(--font-open-sans)] font-black text-[24px] md:text-[32px] leading-none text-[#a10000] tracking-[-0.02em]">{s.val}</span>
                    <span className="font-[family-name:var(--font-open-sans)] text-[9px] md:text-[10px] font-bold tracking-[2px] uppercase text-[#aaa] mt-1">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CORE INDUSTRY SEGMENTS ── */}
      <section className="bg-[#f7f7f7] py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">

          {/* Section header — title left, filter right */}
          <div className="scroll-anim relative z-[50] mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[12px] md:text-[16px] tracking-[4px] uppercase font-bold mb-3 text-[#a10000] font-[family-name:var(--font-open-sans)]">CORE INDUSTRY SEGMENTS</p>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] leading-none mb-4" style={{ letterSpacing: "-0.02em", fontSize: "clamp(20px,3.5vw,48px)" }}>What We<br/>Operate In</h2>
              <p className="font-[family-name:var(--font-rubik)] text-[14px] md:text-[16px] text-[#888] leading-[1.75] max-w-[420px]">
                Ten distinct verticals. Each with its own rules, demands, and market dynamics. We operate inside all of them.
              </p>
            </div>
            {/* Filter dropdown — right-aligned next to heading */}
            <div className="relative flex-shrink-0 self-end md:self-auto" ref={segFilterRef}>
              <button
                onClick={() => setSegDdOpen(v => !v)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3.5 border-2 rounded-xl text-[10px] md:text-[12px] font-bold tracking-[0.07em] uppercase min-w-[160px] md:min-w-[220px] justify-between cursor-pointer transition-all duration-200 font-[family-name:var(--font-open-sans)] whitespace-nowrap
                  ${segDdOpen
                    ? "bg-[#f0f0f0] text-[#1a1a1a] border-[#1a1a1a]"
                    : "bg-white text-[#1a1a1a] border-[#1a1a1a]/30 hover:border-[#1a1a1a]/60 hover:bg-[#f5f5f5]"
                  }`}
                aria-expanded={segDdOpen}
              >
                <span>
                  {activeSegFilter === "all" ? "All Industries" : {
                    kitchen: "Kitchen & Home",
                    electronics: "Electronics",
                    fashion: "Fashion & Lifestyle",
                    home: "Home & Ergonomics",
                    medical: "Healthcare & Medical",
                    automotive: "Automotive",
                    travel: "Travel & Gov't",
                    logistics: "Logistics",
                    software: "Software",
                    specialty: "Specialty & Niche",
                  }[activeSegFilter]}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: segDdOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {segDdOpen && (
                <div className="dd-fade absolute top-[calc(100%+8px)] right-0 bg-white border border-[#e0e0e0] rounded-[14px] z-[300] min-w-[200px] md:min-w-[260px] max-h-[340px] overflow-y-auto" style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.15)", scrollbarWidth: "thin", scrollbarColor: "#ccc #fff" }}>
                  {[
                    { key: "all",         label: "All Industries" },
                    { key: "kitchen",     label: "Kitchen & Home" },
                    { key: "electronics", label: "Electronics" },
                    { key: "fashion",     label: "Fashion & Lifestyle" },
                    { key: "home",        label: "Home & Ergonomics" },
                    { key: "medical",     label: "Healthcare & Medical" },
                    { key: "automotive",  label: "Automotive" },
                    { key: "travel",      label: "Travel & Gov't" },
                    { key: "logistics",   label: "Logistics" },
                    { key: "software",    label: "Software" },
                    { key: "specialty",   label: "Specialty & Niche" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setActiveSegFilter(opt.key); setAutoSegIdx(0); setSegDdOpen(false); }}
                      className={`flex items-center justify-between w-full px-[16px] py-[10px] md:px-[22px] md:py-[11px] text-left font-[family-name:var(--font-open-sans)] text-[10px] md:text-[12px] font-bold tracking-[0.06em] uppercase border-l-[3px] cursor-pointer transition-all duration-150 whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] hover:text-[#1a1a1a]
                        ${activeSegFilter === opt.key
                          ? "border-l-[#a10000] text-[#1a1a1a] bg-[#a10000]/[0.06]"
                          : "border-l-transparent text-[#555]"
                        }`}
                      style={{ borderTop: "none", borderRight: "none", borderBottom: "none" }}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Segment display — single block, filtered or auto-cycling */}
          <div className="flex flex-col">
            {(() => {
              const segImages = [
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1570126618953-d437176e8c79?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=600&fit=crop&crop=center",
              ];
              const segImagesSmall = [
                "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1599202860130-f600f4948364?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600&h=400&fit=crop&crop=center",
              ];

              const segKeyMap: Record<string, number> = {
                kitchen: 0, electronics: 1, fashion: 2, home: 3, medical: 4,
                automotive: 5, travel: 6, logistics: 7, software: 8, specialty: 9,
              };

              // Determine which segment index to show
              const displayIdx = activeSegFilter === "all" ? autoSegIdx : (segKeyMap[activeSegFilter] ?? 0);
              const seg = INDUSTRY_SEGMENTS[displayIdx];
              const i = displayIdx;

              return (
                <div className="scroll-anim bg-[#f7f7f7] rounded-[24px] overflow-visible" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] min-h-[400px] gap-3 p-3">

                    {/* LEFT — large image with overlay, rounded corners */}
                    <div className="relative overflow-hidden rounded-[16px] min-h-[240px] md:min-h-[340px]">
                      <img
                        src={segImages[i % segImages.length]}
                        alt={seg.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)" }} />
                      {/* Number badge — top right, glass effect */}
                      <div className="absolute top-4 right-4 z-[3] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-[family-name:var(--font-open-sans)] text-[9px] md:text-[11px] font-black tracking-[2px] text-white" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                        {`0${i + 1}`.slice(-2)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-[2]">
                        <h3 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-white leading-[1.1] mb-2" style={{ fontSize: "clamp(18px,2.2vw,28px)", letterSpacing: "-0.01em" }}>{seg.title}</h3>
                        <p className="font-[family-name:var(--font-rubik)] text-[12px] md:text-[14px] text-white/55 leading-[1.6] max-w-[340px]">
                          {seg.desc.split(". ")[0]}.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT — small image + text content */}
                    <div className="flex flex-col gap-3">
                      {/* Small image */}
                      <div className="relative overflow-hidden rounded-[16px] h-[140px] md:h-[190px]">
                        <img
                          src={segImagesSmall[i % segImagesSmall.length]}
                          alt={seg.title + " detail"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      {/* Text content */}
                      <div className="flex-1 rounded-[16px] p-6 md:p-8 flex flex-col justify-between" style={{ background: "#fff" }}>
                        <div>
                          <p className="font-[family-name:var(--font-rubik)] text-[12px] md:text-[13.5px] text-[#555] leading-[1.8] mb-5">
                            {seg.desc}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-[#f0f0f0]">
                          <div className="font-[family-name:var(--font-open-sans)] text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase text-[#bbb] mb-3">Partners</div>
                          <div className="flex flex-wrap gap-2">
                            {seg.brands.split(", ").map((brand, bi) => (
                              <span key={bi} className="font-[family-name:var(--font-open-sans)] text-[9px] md:text-[11px] font-bold tracking-[0.5px] uppercase text-[#a10000] px-2 py-0.5 md:px-3 md:py-1 rounded-full" style={{ background: "rgba(161,0,0,0.08)", border: "1px solid rgba(161,0,0,0.15)" }}>
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ONE FRAMEWORK. MULTIPLE INDUSTRIES. ── */}
      <section className="bg-white py-20 border-t border-[#ebebeb]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          {/* Header */}
          <div className="scroll-anim text-center mb-14">
            <span className="inline-block font-[family-name:var(--font-open-sans)] text-[12px] md:text-[16px] font-bold tracking-[4px] uppercase bg-[#a10000] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-md mb-4">WHAT MAKES US DIFFERENT</span>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold uppercase text-[#282828] mb-4" style={{ letterSpacing: "-0.02em", fontSize: "clamp(24px,5vw,48px)", lineHeight: ".95" }}>One Framework.<br/>Multiple Industries.</h2>
            <p className="font-[family-name:var(--font-rubik)] font-normal text-[14px] md:text-[16px] text-[#888] leading-[1.85] max-w-[640px] mx-auto">
              While industries differ, the foundation of success remains the same. We apply a unified operational framework, customized per industry — ensuring both efficiency and relevance.
            </p>
          </div>

          {/* Therapy-style layout: 2 cards | center image | 2 cards */}
          <div className="scroll-anim-2 grid grid-cols-1 md:grid-cols-[1fr_320px_1fr] gap-6 items-center">

            {/* Left column — pillars 0 & 1 */}
            <div className="flex flex-col gap-5">
              {FRAMEWORK_PILLARS.slice(0, 2).map((p, i) => (
                <div key={i} className="rounded-[18px] border border-[#ebebeb] bg-[#fafafa] p-5 md:p-6 flex flex-col gap-3 transition-all duration-200 hover:border-[#a10000]/30 hover:shadow-md" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div className="w-9 h-9 rounded-full bg-[#a10000]/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="font-[family-name:var(--font-open-sans)] font-bold text-[12px] text-[#a10000]">{String(i + 1).padStart(2,"0")}</span>
                  </div>
                  <div className="font-[family-name:var(--font-poppins)] font-bold text-[14px] md:text-[16px] uppercase tracking-[0.04em] text-[#282828] leading-snug">{p.label}</div>
                  <p className="font-[family-name:var(--font-rubik)] font-normal text-[13px] md:text-[14px] text-[#999] leading-[1.7]">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Center — image */}
            <div className="rounded-[22px] overflow-hidden flex-shrink-0 h-[300px] md:h-[460px] order-first md:order-none" style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.13)" }}>
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=920&fit=crop&crop=center"
                alt="Framework"
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Right column — pillars 2 & 3 */}
            <div className="flex flex-col gap-5">
              {FRAMEWORK_PILLARS.slice(2, 4).map((p, i) => (
                <div key={i} className="rounded-[18px] border border-[#ebebeb] bg-[#fafafa] p-5 md:p-6 flex flex-col gap-3 transition-all duration-200 hover:border-[#a10000]/30 hover:shadow-md" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div className="w-9 h-9 rounded-full bg-[#a10000]/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="font-[family-name:var(--font-open-sans)] font-bold text-[12px] text-[#a10000]">{String(i + 3).padStart(2,"0")}</span>
                  </div>
                  <div className="font-[family-name:var(--font-poppins)] font-bold text-[14px] md:text-[16px] uppercase tracking-[0.04em] text-[#282828] leading-snug">{p.label}</div>
                  <p className="font-[family-name:var(--font-rubik)] font-normal text-[13px] md:text-[14px] text-[#999] leading-[1.7]">{p.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* complexity → clarity callout — bottom */}
          <div className="scroll-anim-3 mt-10 rounded-[18px] border border-[#ebebeb] bg-[#fafafa] p-5 md:p-7 max-w-[760px] mx-auto text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div className="font-[family-name:var(--font-open-sans)] font-bold text-[12px] md:text-[16px] uppercase tracking-[4px] text-[#a10000] mb-3">From Complexity to Clarity</div>
            <p className="font-[family-name:var(--font-rubik)] font-normal text-[14px] md:text-[16px] text-[#888] leading-[1.85]">
              Each industry brings its own challenges — technical specifications, regulatory requirements, fast-moving inventories, or niche audiences. Our role is to simplify that complexity and translate it into clear, high-performing marketplace content.
            </p>
          </div>
        </div>
      </section>



    </>
  );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function PlatformOverview() {
  const [activeTab, setActiveTab] = useState<"platforms" | "tools" | "industries">("platforms");

  // Inject only the minimal CSS that Tailwind can't handle
  useEffect(() => {
    const id = "platform-overview-minimal-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = MINIMAL_CSS;
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab as "platforms" | "tools" | "industries");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={FONT_VARS}>
      {activeTab === "platforms"  && <TabPlatforms   onTabSwitch={handleTabSwitch} />}
      {activeTab === "tools"      && <TabTools        onTabSwitch={handleTabSwitch} />}
      {activeTab === "industries" && <TabIndustries   onTabSwitch={handleTabSwitch} />}
    </div>
  );
}